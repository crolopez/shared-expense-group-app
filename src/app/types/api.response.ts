import { DataDto } from "./data.dto"

export interface ApiResponse<T> {
    data: DataDto<T>[]
}
