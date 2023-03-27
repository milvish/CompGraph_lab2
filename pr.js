let x = new Array(5);
let y = new Array(5);

for (let i=0; i<5; i++){
    let radius = 1
    x[i] = radius * Math.sin(360/5 *i);
    y[i] = radius * Math.cos(360/5 * i);
}

for (let i=0; i<5; i++){
    console.log("Точка " + i)
    console.log(x[i])
    console.log(y[i])
}
