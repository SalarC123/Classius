function ValidationError({message}) {
    return (
        <div className="my-5 transition-opacity-100 text-center text-xl text-red-500 p-2 font-extrabold">{message}</div>
    )
}

export default ValidationError;