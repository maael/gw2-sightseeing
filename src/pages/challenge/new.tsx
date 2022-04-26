import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

export default function Index() {
  const { register, handleSubmit, watch, control } = useForm()
  const [data, setData] = useState('')
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fieldArray',
  })
  const watchFieldArray = watch('fieldArray')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })
  return (
    <div className="bg-blue-900 p-10">
      <form className="flex flex-col" onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
        <input {...register('firstName')} placeholder="First name" />
        <select {...register('category')}>
          <option value="">Select...</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
        </select>
        {controlledFields.map((field, index) => {
          return (
            <div key={field.id}>
              <input {...register(`fieldArray.${index}.name` as const)} />
              <input {...register(`fieldArray.${index}.desc` as const)} />
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={() =>
            append({
              name: 'bill',
            })
          }
        >
          Append
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
