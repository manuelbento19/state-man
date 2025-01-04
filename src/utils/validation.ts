class Validation {
    isClientSide(){
        return typeof window !== 'undefined'
    }
}
export default new Validation();