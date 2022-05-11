class CalcController {

/*diferença de let e this
O let permite que você declare variáveis limitando seu escopo no bloco, instrução, ou em uma expressão na qual ela é usada.

O this faz referência ao objeto do qual a função é uma propriedade. Em outras palavras, o this faz referência
 ao objeto que está chamando a função no momento. Suponha que você tenha um objeto chamado counter e 
 ele possui um método chamado next() . Quando você chamar o método next() , você pode acessa o objeto.

*/
    constructor(){

//atributo do construtor, sao variaveis de nosso objeto que desejamos utilizar depois, o "._" tem a ideia de ser privado
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            console.log(text);


        });


    }

    copyToClipboard(){
       
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execComand("Copy");

        input.remove();

    }

    initialize(){
        //criando metodo para reutilizar com "this"
        this.setDisplayDateTime()

        setInterval(()=>{//setInterval função executada em um intervalo de tempo. O tempo é marcado em milisegundos.
                        // Arrow Function é um novo recurso para criação de funções. é uma função porem com resursos mais simples
                        //primeiro não precisa escrever a palavra "function", segundo os "()" que colocamos é para os parametros. e o "=>" significa  , essa função irá fazer isso...

             //reutilizando o metodo
            this.setDisplayDateTime();

        }, 1000); // o segundo parametro seria qual o espaço de tempo de um intervalo e outro por milisegundo.

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();


            });
        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

      
    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{  //keyup consegue captura no momento qual foi a tecla pressionada

            this.playAudio();

            switch (e.key) {  //e é o evento e key é a propriedade que retorna o valor digitado

            case 'Escape':
                this.clearAll();
                break;

            case 'Backspace':
                this.clearEntry();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':

                this.addOperation('+');
                break;

            

            case 'Enter':
            case '=':
                this.calc();
                break;

            case '.': 
            case ',':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(e.key));
                break;

            case 'c':
                if (e.ctrlKey) this.copyToClipboard();
                break;

           

        }

    });


}
    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        })
    
    }
    //metodo para limpar tudo
    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

 //metodo para limpar apenas o ultimo dado   

    clearEntry(){

        this._operation.pop();   // metodo pop éum metodo nativo do js que elimina o ultimo

        this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];   //.length serve para saber o total de itens no array

    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    isOperator(value){

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);   //o metodo "indexof" vai buscar o valor dentro do array e se achar vai trazer o index

    }

    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3) {

            

            this.calc();

            
        }




    }

    getResult(){

      try{
        return  eval(this._operation.join(""));  
      }catch(e){
        setTimeout(()=>{
        this.setError();
      }, 1);
    } 
}

    calc(){
//eval() é uma função de propriedade do objeto global (window) . O argumento da função eval() é uma string. Se a string representa uma expressão, eval() avalia a expressão. Se o argumento representa uma ou mais declarações em JavaScript, eval() avalia as declarações
// Join() ele coloca qualquer coisa que quiser ao inverso do split O método join() junta todos os elementos de um array (ou um array-like object) em uma string e retorna esta string.
        
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator,this._lastNumber];                    


        }
       
        if (this._operation.length > 3) {
            last = this._operation.pop();

            
            this._lastNumber = this.getResult();   
        
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);  
        
        }


        
        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        }else{

        
        this._operation = [result];

        if (last) this._operation.push(last);

}
        
        this.setLastNumberToDisplay();
    }

    

     getLastItem(isOperator = true){
            let lastItem;

        for (let i = this._operation.length-1; i >=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem =  this._operation[i];
                break;
        }

    }

    if (!lastItem) {

        lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

    }

    return lastItem;

}



    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        

        if (!lastNumber) lastNumber = 0;
        
        this.displayCalc = lastNumber;


    }

    addOperation(value){

        //função isNaN () é usado para verificar se os parâmetros estão não numérico.
      // Se este parâmetro é não-numérico ou string valor NaN, o objeto, indefinido e outros retorna true, caso contrário, retorna false.
        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value);

          

            } else {
                 //Number
                this.pushOperation(value);    //o metodo push pega a um array vai no final e adiciona um informação.

               this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)){

                this.pushOperation(value);

            }else{

            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(newValue);

            this.setLastNumberToDisplay();

            //atualizar display
         

            }

           

        }


    }

    //definindo o erro.
    setError(){

        this.displayCalc = "Error";
        
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();


    }

    execBtn(value){

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }

    }

    initButtonsEvents(){
        // metodo  mais robusto chamado "addEventListenerAll" que criamos para tratar multiplos eventos, esse metodo importante em varias aplicações
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-","");

                this.execBtn(textBtn);

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            })

        })

    }
    //Refatorar significa melhorar ou refazer o código otimizando o mesmo.

    setDisplayDateTime(){
        //personalizando a data e alterando de numerico por extenso 
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

// get  tem a função de retornar um valor, e o  set  serve para atribuir um valor.

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){

        if(value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        this._currentDate = value;

    }

}