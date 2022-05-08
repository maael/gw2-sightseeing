import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ObjectId } from 'bson'
import { useChallenge } from '~/util/queries'
import { ChallengeForm } from '~/types'
import useLink from './useLink'
import React from 'react'

export function useChallengeForm(grab: () => Promise<File | undefined>) {
  const { query, push } = useRouter()
  const isEdit = query.id?.toString() !== 'new'
  const id = isEdit ? query.id?.toString() : new ObjectId().toString()
  const { register, handleSubmit, watch, control, reset, setValue } = useForm<ChallengeForm>({
    defaultValues: {
      id,
    },
  })
  useChallenge(isEdit ? query.id?.toString() : undefined, (initial) => {
    const steps = initial?.steps?.map((step) => step)
    reset({ name: initial?.name, id: initial.id, description: initial.description, steps })
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
  React.useEffect(() => {
    setValue('id', id)
  }, [setValue, id])
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
      body: JSON.stringify(
        data,
        (_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      ),
    })
      .then(async (r) => {
        if (r.ok) return r.json()
        throw new Error(`[${r.status}]: ${await r.text()}`)
      })
      .then((data) => push(data.id ? `/challenges/${data.id}` : '/'))
  })
  const { link, mapData } = useLink()
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
      add: async () => {
        const image = await grab()
        const location = {
          x: link?.avatar.position[0] || 0,
          y: link?.avatar.position[2] || 0,
          z: link?.avatar.position[1] || 0,
        }
        append({
          id: new ObjectId().toString(),
          location,
          precision: BigInt(100),
          image,
          name: `Somewhere in ${mapData?.name || 'the mists'}`,
        })
      },
      handleDrag: (e) => move(e.active.data.current?.sortable.index, e.over?.data.current?.sortable.index),
    },
    setValue,
    controlledFields,
    onSubmit,
  }
}
