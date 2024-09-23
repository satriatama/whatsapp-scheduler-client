'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type FormData = {
  username: string
  password: string
}

export function Page() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      // const result = await signIn('credentials', {
      //   username: data.username,
      //   password: data.password,
      //   redirect: false,
      // })
      if (data.username !== 'satriatama' || data.password !== 'admin321') {
        setError('Invalid username or password')
      } else {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', data.username)
        router.push('/scheduler') // Redirect to dashboard on successful login
      }
    } catch (error) {
      setError(`An unexpected error occurred ${error}` )
    }
  }

  return (
    <div className="w-full max-w-md m-auto my-24 p-8 space-y-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register('username', { required: 'Username is required' })}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>
      </div>
  )
}