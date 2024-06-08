import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createEmail({ email, subject, message, sendAt, status, repeat }) {
    try {
        const newEmail = await prisma.email.create({
            data: { email, subject, message, sendAt: new Date(sendAt), status, repeat, },
        });
        return newEmail
    } catch (err) {
        return { err: true, data: err }
    }
}

export async function readEmail() {
    try {
        const allEmail = await prisma.email.findMany()
        return allEmail
    } catch (err) {
        return { err: true, data: err }
    }
}

export async function deleteEmail({ id }) {
    try {
        const result = await prisma.email.delete({ where: { id: parseInt(id) }, });
        return result
    } catch (err) {
        return { err: true, data: err }
    }
}

export async function updateStatusEmail({ id, status }) {
    try {
        const result = await prisma.email.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        return { success: true, result }
    } catch (error) {
        return { error: 'Failed to update email status', details: error.message }
    }
}

export async function readEmailByPending() {
    try {
        const Email = await prisma.email.findMany({
            where: { status: 'pending' },
        })
        return Email
    } catch (err) {
        return { err: true, data: err }
    }
}