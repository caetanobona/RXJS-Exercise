export interface PaymentData {
  id : string
  amount : number
  status : status
  email : string
}

enum status {
  Failed = "FAILED",
  Success = "SUCESS",
  Processing = "PROCESSING"
}