import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ObjectId } from 'bson'
import { useChallenge } from '~/util/queries'
import { ChallengeForm } from '~/types'

export function useChallengeForm() {
  const { query, push } = useRouter()
  const isEdit = query.id?.toString() !== 'new'
  const { register, handleSubmit, watch, control, reset, setValue } = useForm<ChallengeForm>({
    defaultValues: {
      id: isEdit ? query.id?.toString() : new ObjectId().toString(),
    },
  })
  useChallenge(isEdit ? query.id?.toString() : undefined, (initial) => {
    const steps = initial?.steps?.map((step) => step)
    reset({ name: initial?.name, steps })
    replace(steps as any)
  })
  const { fields, append, remove, move, replace } = useFieldArray({
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
  const onSubmit = handleSubmit(async (data) => {
    const images = new Map(
      data.steps.filter((step) => step.image instanceof File).map((step) => [`${step.id}.png`, step.image])
    )
    const res = await fetch('/api/s3', {
      method: 'POST',
      body: JSON.stringify({
        objectId: data.id,
        keys: [...images.keys()],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())
    await Promise.all(
      res.map(async ({ signedUrl, key }) => {
        await fetch(signedUrl, { method: 'PUT', body: images.get(key) })
      })
    )
    data.steps = data.steps.map((step) => {
      step.image = `${data.id}/${step.id}.png`
      return step
    })
    await fetch(`/api/challenges`, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.json())
    // .then((data) => push(data.id ? `/challenges/${data.id}` : '/'))
  })
  return {
    register,
    handleSubmit,
    watch,
    isEdit,
    push,
    id: isEdit ? query.id?.toString() : new ObjectId().toString(),
    steps: {
      fields,
      append,
      remove,
      move,
      add: () =>
        append({
          id: new ObjectId().toString(),
          location: {
            x: 1,
            y: 2,
            z: 3,
          },
          precision: 100,
        }),
      handleDrag: (e) => move(e.active.data.current?.sortable.index, e.over?.data.current?.sortable.index),
    },
    setValue,
    controlledFields,
    onSubmit,
  }
}
