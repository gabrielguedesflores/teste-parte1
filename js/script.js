class Validator {
    
    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-valid-cpf',
            'data-check-active',
        ]
    }

    validate(form) { 
        let currentValidations = document.querySelectorAll('form .error-validation');
        if(currentValidations.length > 0){
            this.cleanValidation(currentValidations);
        }
        let inputs = form.getElementsByTagName('input');
        let inputsArray = [...inputs]; //transforma HTMLCollection em array - restOperator
        inputsArray.forEach(function(input){
            for(let i = 0; this.validations.length > i; i++) {
                if(input.getAttribute(this.validations[i]) != null){
                    let method = this.validations[i].replace('data-', '').replace('-', '');
                    let value = input.getAttribute(this.validations[i]);
                    this[method](input, value);
                }
            }
        }, this);
    }

    minlength(input, minValue){
        let inputLength = input.value.length;
        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;
        if (inputLength < minValue) {
            this.printMessage(input, errorMessage);
        }
    }

    maxlength(input, maxValue){
        let inputLength = input.value.length;
        let errorMessage = `A campo precisa ter menos que ${maxValue} caracteres`;
        if(inputLength > maxValue){
            this.printMessage(input, errorMessage)
        }
    }

    emailvalidate(input){
        let re = /\S+@\S+\.\S+/;
        let email = input.value;
        let errorMessage = `Insira um e-mail no padrão gabriel@gmail.com`; 
        if(!re.test(email)){
            this.printMessage(input, errorMessage);
        }
    }

    required(input){
        let inputValue = input.value;
        if(inputValue === ''){
            let errorMessage = `Este campo é obrigatório`;
            this.printMessage(input, errorMessage);
        }
    }

    validcpf(input) {
        let cpf = input.value;
        let errorMessage = `O CPF não é válido`;
        if (typeof cpf !== "string") return this.printMessage(input, errorMessage);
        cpf = cpf.replace(/[\s.-]*/igm, '')
        if (!cpf ||
            cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999"
        ) {
            return this.printMessage(input, errorMessage);
        }
        var soma = 0
        var resto
        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11)) resto = 0
        if (resto != parseInt(cpf.substring(9, 10))) return this.printMessage(input, errorMessage);
        soma = 0
        for (var i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11)) resto = 0
        if (resto != parseInt(cpf.substring(10, 11))) return this.printMessage(input, errorMessage);
        return true
    }

    printMessage(input, msg){
        let errorsQty = input.parentNode.querySelector('.error-validation');
        //validação para não deixar 2 validações ao mesmo tempo
        if(errorsQty === null){ 
            let template = document.querySelector('.error-validation').cloneNode(true);
            template.textContent = msg;
            let inputParent = input.parentNode;
            template.classList.remove('template');
            inputParent.appendChild(template);
        } 
    }

    cleanValidation(validations){
        validations.forEach(el => el.remove()); //percerre o erro e remove
    }

}

const sendForm = (data) =>{
    document.getElementById('street').value = data.logradouro;
    document.getElementById('neighborhood').value = data.bairro;
    document.getElementById('city').value = data.cidade;
    document.getElementById('state').value = data.estado_info.nome;
}

const searchZipcode = () => {
    const zipCodeBefore = cep = document.getElementById("zipcode").value;
    const zipCode = zipCodeBefore.replace('.', '').replace('-', '');
    const url = `https://api.postmon.com.br/v1/cep/${zipCode}`;
    const request = new XMLHttpRequest(); 
    request.open('GET', url);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var jsonData = request.response;
        sendForm(jsonData);
    }
}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");
let cep = document.getElementById("zipcode")
                                      .addEventListener("focusout", searchZipcode);
let validator = new Validator();

submit.addEventListener('click', function(e)  {
    e.preventDefault(); 
    validator.validate(form);
});


