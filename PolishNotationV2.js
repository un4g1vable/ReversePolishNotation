let fs = require ('fs');
let arg = process.argv;
let InputExpression = fs.readFileSync(arg[2]);
InputExpression = InputExpression.toString();
let Numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

function toReversePolish(expression) {
    let result = '';
    let stack = [];
    const Priority = {'+': 0, '-': 0, '*': 1, '/': 1, '^': 2};

    for (let i=0; i<expression.length; ++i) {
        const CurSym = expression.charAt(i);
        const CurSym1 = expression.charAt(i+1);
        // ^ Берём текущий символ выражения (идём с начала)
        if ((Numbers).indexOf(CurSym) >= 0) {
            result += CurSym;
            if ((Numbers).indexOf(CurSym1) < 0)
                result += " ";}
        // ^ Если это цифра - записываем в результат (если после цифры идёт знак - ставим разделитель (пробел))
        else if (CurSym === '(') {
            stack.push(CurSym);
        }
        // ^ Если это открывающая скобка - добавляем её в стэк
        else if (CurSym === ')') {
            let s = stack.pop();

            while (s && s !== '(') {
                result += " " + s + " ";
                s = stack.pop();
            }
        // ^ Если получили закрывающую скобку - выталикваем из стека все операции в результат,
        //  пока не наткнёмся на открывающую скобку

        } else if (Object.keys(Priority).indexOf(CurSym) >= 0) {
        // ^ Если попался знак операции
            while ( Priority[stack.slice(-1)[0]] >= Priority[CurSym]) {
                result += " " + stack.pop() + " ";
            }
            // ^ Пока приоритет опреации в стэке >= приоритета CurSym - выталкиваем в result
            // знаки из стэка.
            stack.push(CurSym);
            // Добавляем в стэк текущий знак
        }
    }
    let sym = '';
    while (sym = stack.pop()) {
        result += " " + sym;
    }
    // ^ Когда прошлись по всему выражению - опустошаем стэк, добавляя знаки операций в result

    return result.replaceAll("  ", " ");
    // ^ Возвращаем обратную польскую запись исходного выражения
    // ^ Если в ходе преобразования вышло так, что образовалось несколько подряд стоящих пробелов - избавляемся от этого
}

function Calc(newExpression) {
    let expression = newExpression.split(" ");
    // ^ Представляем выражение в виде массива, состоящего из чисел и знаков
    let stack =[];
    if(expression === ''){
        return 0;
    }
    // ^ Если выражение пустое - возвращаем 0
    for(let i=0; i<expression.length; i++) {
        if(isFinite(expression[i])) {
            stack.push(expression[i]);
            // ^ Если число - добавляем в стэк
        }else {
            let a = stack.pop();
            let b = stack.pop();
            // ^ Присваиваем a и b первые два числа, удаляя при это их из стэка
            if(expression[i] === "+") {
                stack.push(parseFloat(a) + parseFloat(b));
            } else if(expression[i] === "-") {
                stack.push(parseFloat(b) - parseFloat(a));
            } else if(expression[i] === "*") {
                stack.push(parseFloat(a) * parseFloat(b));
            } else if(expression[i] === "/") {
                stack.push(parseFloat(b) / parseFloat(a));
            } else if(expression[i] === "^") {
                stack.push(Math.pow(parseFloat(b), parseFloat(a)));
            }
            // Выполняем действие, после чего добавляем результат в конец стэка
        }
    }
    if(stack.length > 1) {
        return "Error";
        // ^ Если в стэке осталось больше 1 элемента - выводим ошибку
    }else {
        return stack[0];
        // ^ Возвращаем результат подсчётов
    }
}
console.log ("Original expression:", InputExpression)
console.log ("Reverse Polish notation:", toReversePolish(InputExpression))
console.log ("Result:",Calc(toReversePolish(InputExpression)))

