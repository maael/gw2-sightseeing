import * as React from 'react'
import { CgAddR } from 'react-icons/cg'
import { MdOutlineSave } from 'react-icons/md'
import { SortableContext } from '@dnd-kit/sortable'
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import Input from '~/components/primitives/Input'
import { useChallengeForm } from '~/components/hooks/useChallengeForm'
import Item from '~/components/primitives/ChallengeFormStep'

class PointerSensorWithoutPreventDefault extends PointerSensor {
  static SKIP_ELEMENTS = ['INPUT', 'BUTTON']
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent }: React.PointerEvent) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false
        }

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
  const { register, onSubmit, controlledFields, steps, setValue } = useChallengeForm()
  const sensors = useSensors(useSensor(PointerSensorWithoutPreventDefault))
  return (
    <div className="wrapper">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <input {...register('id')} type="hidden" />
        <Input register={register} name="name" label="Challenge Name" />
        <Input register={register} name="description" label="Challenge Description" />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DndContext onDragEnd={steps.handleDrag} sensors={sensors}>
              <SortableContext items={controlledFields.map((f) => f.id)}>
                {controlledFields.map((field, index) => (
                  <Item
                    key={field.id}
                    id={field.id}
                    register={register}
                    index={index}
                    steps={steps}
                    setValue={setValue}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <button
          className="text-xl bg-green-400 px-2 py-1 rounded-sm text-green-800 flex gap-2 items-center justify-center"
          type="button"
          aria-label="Add item"
          onClick={steps.add}
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
