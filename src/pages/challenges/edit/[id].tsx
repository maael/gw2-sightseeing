import * as React from 'react'
import { useForm, useFieldArray, UseFormRegister, UseFormSetValue, UseFieldArrayRemove } from 'react-hook-form'
import { CgTrash, CgAddR } from 'react-icons/cg'
import { MdOutlineDragHandle, MdOutlineSave } from 'react-icons/md'
import { useRouter } from 'next/router'
import { ObjectId } from 'bson'
import { useChallenge } from '~/util/queries'
import PreviewImageInput from '~/components/primitives/PreviewImageInput'
import Input from '~/components/primitives/Input'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface ChallengeForm {
  id?: string
  name: string
  description: string
  steps: Array<{
    id: string
    name: string
    image: string | File
    location: {
      x: number
      y: number
      z: number
    }
    precision: number
  }>
  category: string
}

function useChallengeForm() {
  const { register, handleSubmit, watch, control, reset, setValue } = useForm<ChallengeForm>()
  const { query, push } = useRouter()
  const isEdit = query.id?.toString() !== 'new'
  useChallenge(isEdit ? query.id?.toString() : undefined, (initial) => {
    console.info('loaded', initial)
    const steps = initial?.steps?.map((step) => step)
    reset({ name: initial?.name, steps })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replace(steps as any)
  })
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: 'steps',
  })
  return {
    register,
    handleSubmit,
    watch,
    isEdit,
    push,
    id: query.id?.toString(),
    steps: { fields, append, remove, move },
    setValue,
  }
}

function Item({
  id,
  index,
  register,
  steps,
  setValue,
}: {
  id: string
  index: number
  register: UseFormRegister<ChallengeForm>
  setValue: UseFormSetValue<ChallengeForm>
  steps: { remove: UseFieldArrayRemove }
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col p-2 gap-2 ring-1 ring-white rounded-md px-3 bg-slate-600"
    >
      <input type="hidden" {...register(`steps.${index}.id`)} />
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
      <PreviewImageInput onChange={(file) => setValue(`steps.${index}.image`, file)} />
      <div className="grid grid-cols-1 gap-2">
        <Input<ChallengeForm> register={register} name={`steps.${index}.name`} label="Name" />
        <Input<ChallengeForm> register={register} name={`steps.${index}.description`} label="Notes" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Input<ChallengeForm> register={register} name={`steps.${index}.location.x`} label="X" />
        <Input<ChallengeForm> register={register} name={`steps.${index}.location.y`} label="Y" />
        <Input<ChallengeForm> register={register} name={`steps.${index}.location.z`} label="Z" />
      </div>
      <Input<ChallengeForm> register={register} name={`steps.${index}.precision`} label="Precision" />
    </div>
  )
}

class PointerSensorWithoutPreventDefault extends PointerSensor {
  static SKIP_ELEMENTS = ['INPUT', 'BUTTON']
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent }: React.PointerEvent) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shouldSkip = (nativeEvent as any).path.some((el) => {
          return this.SKIP_ELEMENTS.includes(el.tagName) || el.classList?.contains('dropzone')
        })

        if (shouldSkip) {
          return false
        }

        return true
      },
    },
  ]
}

export default function Index() {
  const { register, handleSubmit, watch, isEdit, /*push,*/ id, steps, setValue } = useChallengeForm()
  const watchFieldArray = watch('steps')
  const controlledFields = steps.fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    const objectId = data.id || new ObjectId().toString()
    const images = new Map(
      data.steps.filter((step) => step.image instanceof File).map((step) => [`${step.id}.png`, step.image])
    )
    const res = await fetch('/api/s3', {
      method: 'POST',
      body: JSON.stringify({
        objectId,
        keys: [...images.keys()],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())
    await Promise.all(
      res.map(async ({ signedUrl, key }) => {
        console.info('uploading?', key, images.get(key))
        await fetch(signedUrl, { method: 'PUT', body: images.get(key) })
      })
    )
    await fetch(`/api/challenges${isEdit ? `?id=${id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.json())
    // .then((data) => push(data.id ? `/challenges/${data.id}` : '/'))
  })
  const sensors = useSensors(useSensor(PointerSensorWithoutPreventDefault))
  return (
    <div className="wrapper">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <Input register={register} name="name" label="Challenge Name" />
        <Input register={register} name="description" label="Challenge Description" />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DndContext
              onDragEnd={(e) => {
                steps.move(e.active.data.current?.sortable.index, e.over?.data.current?.sortable.index)
              }}
              sensors={sensors}
            >
              <SortableContext items={controlledFields.map((f) => f.id)}>
                {controlledFields.map((field, index) => {
                  return (
                    <Item
                      key={field.id}
                      id={field.id}
                      register={register}
                      index={index}
                      steps={steps}
                      setValue={setValue}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <button
          className="text-xl bg-green-400 px-2 py-1 rounded-sm text-green-800 flex gap-2 items-center justify-center"
          type="button"
          aria-label="Add item"
          onClick={() =>
            steps.append({
              id: new ObjectId().toString(),
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
