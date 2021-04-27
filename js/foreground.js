
if (typeof searchForPasswordInput !== 'function') {
    window.searchForPasswordInput = () => {
        inputs = document.querySelectorAll("input[type='password']")
        if (inputs.length > 0) {
            username_text_input = document.querySelectorAll("input[type='email']")
            if (username_text_input.length == 0)
            username_text_input = document.querySelectorAll("input[type='text']") 

            console.log(username_text_input)
        }
        console.log(inputs)
    }
}


searchForPasswordInput()