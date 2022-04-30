import { Path, UseFormRegister } from 'react-hook-form'

export default function Input<Form>({
  register,
  name,
  label,
}: {
  label: string
  name: string
  register: UseFormRegister<Form>
}) {
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
          {...register(name as Path<Form>)}
          type="text"
          id={name}
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 px-2 py-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`${label}...`}
        />
      </div>
    </>
  )
}
