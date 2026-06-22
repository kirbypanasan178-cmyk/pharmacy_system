import { v4 as uuidv4 } from "uuid"

const KEY = "order_idempotency_key"

export const createIdempotencyKey = () => {
    let key = sessionStorage.getItem(KEY)

    if (!key) {
        key = uuidv4()
        sessionStorage.setItem(KEY, key)
    }



    return key
}

export const clearIdempotencyKey = () => {
    sessionStorage.removeItem(KEY)
}