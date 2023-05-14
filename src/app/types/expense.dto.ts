export interface ExpenseDto {
    amount: number
    description: string
    dateCreated?: string
    dateCreatedEpoch?: number
    currency?: string
    user?: string
}
