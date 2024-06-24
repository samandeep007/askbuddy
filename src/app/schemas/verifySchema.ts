import { z } from 'zod'

export const codeValidation = z.string()
                             .length(6, { message: "OTP must be six digits" })
                             

export const verifySchema = z.object({
    code: codeValidation
})