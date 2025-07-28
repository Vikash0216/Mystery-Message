'use client'

import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { messgeSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import {  FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useState } from 'react'

const Page = () => {
  const { userName } = useParams()
  const [isSent, setIsSent] = useState(false)

  if (!userName || typeof userName !== 'string') {
    return <div className="text-center text-red-500 mt-10">Invalid user</div>
  }

  const form = useForm<z.infer<typeof messgeSchema>>({
    resolver: zodResolver(messgeSchema),
    defaultValues:{
      content:''
    }
  })

  const onSubmit = async (data: z.infer<typeof messgeSchema>) => {
    try {
      await axios.post(`/api/send-message/${userName}`, data)
      toast("Sent", {
        description: "Message sent successfully",
        duration: 2000,
      })
      form.reset()
      setIsSent(true)
      setTimeout(() => setIsSent(false), 3000)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage =
        axiosError.response?.data.message ?? "Failed to send message"
      toast(`${errorMessage}`, {
        description: errorMessage,
        duration: 2000,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Public Profile Link
          </h1>
          <p className="text-gray-600">
            Send anonymous message to <span className="font-medium text-indigo-600">{userName}</span>
          </p>
        </div>
        
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Write your anonymous message here"
                      {...field}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting
                ? 'Sending...'
                : isSent
                ? 'Sent ✅'
                : 'Send'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default Page
