export const isValidEmail = (email)=>{
    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

export const isValidUserName = (username)=>{
    const pattern = /^[a-z][a-zA-Z0-9._]{2,19}$/;
    return pattern.test(username)
}