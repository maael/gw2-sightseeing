import * as React from 'react'
import { UseFormRegister, UseFormSetValue, UseFieldArrayRemove } from 'react-hook-form'
import { CgTrash } from 'react-icons/cg'
import { MdOutlineDragHandle } from 'react-icons/md'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PreviewImageInput from '~/components/primitives/PreviewImageInput'
import Input from '~/components/primitives/Input'
import { ChallengeForm } from '~/types'

export default function ChallengeFormStep({
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
