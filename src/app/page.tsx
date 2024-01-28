'use client'

import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/Form'

/**
 * To - do
 * [x] - Validação /transformação
 * [x] - Field Arrays
 * [ ] - Upload de arquivos - Supabase
 * [ ] - Composition Pattern
 */


const createUseFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')
  }),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido').refine(email => {
    return email.endsWith('@rocketseat.com.br')
  }, 'O e-mail precisa ser da Rocketseat'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().min(1, 'título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)
  })).min(2, 'Insira pelo menos 2 tecnologias')
})

type CreateUserFormData = z.infer<typeof createUseFormSchema>

export default function Home() {

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUseFormSchema)
  })

  // const { register, handleSubmit, formState: { errors }, control } = useForm<CreateUserFormData>({
  //   resolver: zodResolver(createUseFormSchema)
  // })

  const {
    handleSubmit,
    formState: { isSubmitting },
    control
  } = createUserForm

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs'
  })

  function createUser(data: any) {
    console.log("data", data)
  }

  function addNewTech() {
    append({ title: "", knowledge: 0 })
  }

  return (
    <main className="min-h-screen bg-zinc-900 flex items-center justify-center text-white"  >
      <FormProvider {...createUserForm}>
        <form
          className="flex flex-col gap-4 w-full max-w-xs"
          onSubmit={handleSubmit(createUser)}
        >
          <Form.Field>
            <Form.Label htmlFor='name'>
              Nome
            </Form.Label>
            <Form.Input name='name' type='name' />
            <Form.ErrorMessage field='name' />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor='email'>
              E-mail
            </Form.Label>
            <Form.Input name='email' type='email' />
            <Form.ErrorMessage field='email' />

          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor='password'>
              Password
            </Form.Label>
            <Form.Input name='password' type='password' />
            <Form.ErrorMessage field='password' />

          </Form.Field>
          <Form.Field>
            <Form.Label>
              Tecnologias

              <button
                type="button"
                onClick={addNewTech}
                className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
              >
                Adicionar nova
              </button>
            </Form.Label>
            <Form.ErrorMessage field="techs" />

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`
              const fieldKnowlegde = `techs.${index}.knowledge`


              return (

                <Form.Field key={field.id}>
                  <div className="flex gap-2 items-center">
                    <div>
                      <Form.Input type={fieldName} name={fieldName} />
                      <Form.ErrorMessage field={fieldName} />
                    </div>
                    <div>
                      <Form.Input type={fieldKnowlegde} name={fieldKnowlegde} />
                      <Form.ErrorMessage field={fieldKnowlegde} />
                    </div>

                  </div>
                </Form.Field>


              )
            })}
          </Form.Field>
          {/* <div className="flex flex-col gap-1">
            <label htmlFor="" className='flex items-center justify-between'>
              Tenologias

              <button
                onClick={addNewTech}
                className='text-emerald-500 text-sm'
              >
                Adicionar
              </button>

            </label>

            {fields.map((field, index) => {
              return (
                <div key={field.id} className='flex gap-2'>
                  <div className='flex flex-1 flex-col gap-1'>
                    <input
                      type="text"
                      className=" border border-zinc-600 bg-zinc-800 shadow-sm rounded h-10 px-3 outline-none"
                      {...register(`techs.${index}.title`)}
                    />
                    {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title?.message}</span>}
                  </div>
                  <div className='flex flex-1 flex-col gap-1'>
                    <input
                      type="number"
                      className="w-16 border border-zinc-600 bg-zinc-800 shadow-sm rounded h-10 px-3 outline-none"
                      {...register(`techs.${index}.knowledge`)}
                    />

                    {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span>}
                  </div>
                </div>
              )
            })}
            {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
          </div> */}
          <button type="submit" className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600">Salvar</button>
        </form>
      </FormProvider>
    </main>
  );
}
