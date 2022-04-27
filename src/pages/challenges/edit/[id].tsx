import * as React from 'react'
import { useForm, useFieldArray, UseFormRegister } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { CgTrash, CgAddR } from 'react-icons/cg'
import { MdOutlineDragHandle, MdOutlineSave } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useChallenge } from '~/util/queries'

interface ChallengeForm {
  name: string
  description: string
  steps: Array<{
    id: string
    name: string
    location: {
      x: number
      y: number
      z: number
    }
    precision: number
  }>
  category: string
}

function Input({ register, name, label }: { label: string; name: string; register: UseFormRegister<ChallengeForm> }) {
  return (
    <>
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">
        {label}
      </label>
      <div className="flex flex-1">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-slate-800 dark:text-gray-400 dark:border-gray-600">
          {label}
        </span>
        <input
          {...register(name as keyof ChallengeForm)}
          type="text"
          id={name}
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 px-2 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`${label}...`}
        />
      </div>
    </>
  )
}

function useChallengeForm() {
  const { register, handleSubmit, watch, control, reset } = useForm<ChallengeForm>({ defaultValues: {} })
  const { query, push } = useRouter()
  const isEdit = query.id?.toString() !== 'new'
  const { data } = useChallenge(isEdit ? query.id?.toString() : undefined)
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: 'steps',
  })
  React.useEffect(() => {
    const steps = data?.steps?.map((step) => step)
    reset({ name: data?.name, steps })
    replace(steps as any)
  }, [data, reset, replace])
  return {
    register,
    handleSubmit,
    watch,
    isEdit,
    push,
    id: query.id?.toString(),
    steps: { fields, append, remove, move },
  }
}

export default function Index() {
  const { register, handleSubmit, watch, isEdit, push, id, steps } = useChallengeForm()
  const watchFieldArray = watch('steps')
  const controlledFields = steps.fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })
  const onDragEnd = React.useCallback(
    (drop) => {
      steps.move(drop.source.index, drop.destination.index)
    },
    [steps]
  )
  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit((data) => {
          void fetch(`/api/challenges${isEdit ? `?id=${id}` : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(data),
          })
            .then((r) => r.json())
            .then((data) => push(data.id ? `/challenges/${data.id}` : '/'))
        })}
        className="flex flex-col gap-2"
      >
        <Input register={register} name="name" label="Challenge Name" />
        <Input register={register} name="description" label="Challenge Description" />
        <select {...register('category')}>
          <option value="">Select...</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
        </select>
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(dropProvided, _dropSnapshot) => (
                <div {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="flex flex-col gap-2">
                  {controlledFields.map((field, index) => {
                    return (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(dragProvided, _dragSnapshot) => (
                          <div
                            key={field.id}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={dragProvided.draggableProps.style}
                            className="flex flex-col p-2 gap-2 ring-1 ring-white rounded-md px-3 bg-slate-600"
                          >
                            <div className="flex flex-row items-center gap-2">
                              <MdOutlineDragHandle className="transition-transform transform hover:animate-pulse hover:scale-125" />
                              <div className="flex-1">Step {index + 1}.</div>
                              <button
                                className="px-2 py-1 rounded-sm text-red-600 text-lg transition-transform transform hover:animate-pulse hover:scale-125"
                                type="button"
                                onClick={() => steps.remove(index)}
                              >
                                <CgTrash />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Input register={register} name={`steps.${index}.name`} label="Step Name" />
                              <Input register={register} name={`steps.${index}.description`} label="Step Description" />
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                              <Input register={register} name={`steps.${index}.location.x`} label="X" />
                              <Input register={register} name={`steps.${index}.location.y`} label="Y" />
                              <Input register={register} name={`steps.${index}.location.z`} label="Z" />
                              <Input register={register} name={`steps.${index}.precision`} label="Precision" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <button
          className="text-xl bg-green-400 px-2 py-1 rounded-sm text-green-800 flex gap-2 items-center justify-center"
          type="button"
          aria-label="Add item"
          onClick={() =>
            steps.append({
              location: {
                x: 1,
                y: 2,
                z: 3,
              },
              precision: 100,
            })
          }
        >
          <CgAddR />
        </button>
        <button
          className="text-2xl bg-green-500 px-2 py-1 rounded-sm text-green-800 flex gap-2 items-center justify-center"
          type="submit"
          aria-label="Save"
        >
          <MdOutlineSave />
        </button>
      </form>
    </div>
  )
}
