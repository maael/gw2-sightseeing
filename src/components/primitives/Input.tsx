import { Path, UseFormRegister } from 'react-hook-form'

export default function Input<Form>({
  register,
  name,
  label,
  hideLabel,
}: {
  label: string
  name: string
  register: UseFormRegister<Form>
  hideLabel?: boolean
}) {
  return (
    <>
      <label htmlFor={name} className="hidden">
        {label}
      </label>
      <div className="flex flex-1 gap-2">
        {hideLabel ? null : <span className="inline-flex items-center text-md">{label}:</span>}
        <input
          {...register(name as Path<Form>)}
          type="text"
          id={name}
          style={{ borderColor: '#4E371B' }}
          className="block flex-1 min-w-0 w-full text-sm px-2 py-1 bg-transparent border-b-2 placeholder:text-black shadow-transparent"
          placeholder={`${label}...`}
        />
      </div>
    </>
  )
}
