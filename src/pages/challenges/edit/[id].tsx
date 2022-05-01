import * as React from 'react'
import { CgAddR } from 'react-icons/cg'
import { MdOutlineSave } from 'react-icons/md'
import { SortableContext } from '@dnd-kit/sortable'
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import Input from '~/components/primitives/Input'
import { useChallengeForm } from '~/components/hooks/useChallengeForm'
import Item from '~/components/primitives/ChallengeFormStep'
import useScreenGrab from '~/components/hooks/useScreenGrab'
import Parchment from '~/components/primitives/Parchment'

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
  const { elements, grab } = useScreenGrab()
  const { register, onSubmit, controlledFields, steps, setValue } = useChallengeForm(grab)
  const sensors = useSensors(useSensor(PointerSensorWithoutPreventDefault))
  return (
    <div className="wrapper pb-10">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-row gap-5 items-start">
          <Parchment outerClassName="flex-1" className="flex flex-col gap-2">
            <input {...register('id')} type="hidden" />
            <Input register={register} name="name" label="Challenge Name" />
            <Input register={register} name="description" label="Challenge Description" />
          </Parchment>
          {elements}
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DndContext onDragEnd={steps.handleDrag} sensors={sensors}>
              <SortableContext items={controlledFields.map((f) => f.id)}>
                {controlledFields.map((field, index) => (
                  <Item
                    key={field.id}
                    register={register}
                    index={index}
                    steps={steps}
                    setValue={setValue}
                    field={field}
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
