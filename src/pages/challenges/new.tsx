import * as React from 'react'
import { useForm, useFieldArray, UseFormRegister, FieldValues } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function Input({ register, name, label }: { label: string; name: string; register: UseFormRegister<FieldValues> }) {
  return (
    <>
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">
        {label}
      </label>
      <div className="flex flex-1">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          {label}
        </span>
        <input
          {...register(name)}
          type="text"
          id={name}
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 px-2 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`${label}...`}
        />
      </div>
    </>
  )
}

export default function Index() {
  const { register, handleSubmit, watch, control } = useForm()
  const [data, setData] = React.useState('')
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'steps',
  })
  const watchFieldArray = watch('steps')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })
  const onDragEnd = React.useCallback(
    (drop) => {
      console.info('from', drop.source.index, drop.destination.index)
      move(drop.source.index, drop.destination.index)
    },
    [move]
  )
  return (
    <div className="bg-blue-900 p-10">
      <form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))} className="flex flex-col gap-2">
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
                            className="flex flex-col p-2 gap-2 bg-blue-200"
                          >
                            <div className="flex flex-row">
                              <div className="flex-1">Step {index + 1}.</div>
                              <button
                                className="bg-red-400 px-2 py-1 rounded-sm text-sm text-red-800"
                                type="button"
                                onClick={() => remove(index)}
                              >
                                -
                              </button>
                            </div>
                            <Input register={register} name={`steps.${index}.name`} label="Step Name" />
                            <Input register={register} name={`steps.${index}.description`} label="Step Description" />
                            <div className="flex flex-row gap-2">
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
          className="bg-green-400 px-2 py-1 rounded-sm text-sm text-green-800"
          type="button"
          onClick={() =>
            append({
              location: {
                x: 1,
                y: 2,
                z: 3,
              },
              precision: 100,
            })
          }
        >
          +
        </button>
        <input {...register('aboutYou')} placeholder="About you" />
        <p className="text-white">{data}</p>
        <button className="bg-slate-200" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
