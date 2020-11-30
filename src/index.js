const toDos = document.querySelector(".toDoForm"),
    input = document.querySelector("input"),
    pending = document.querySelector(".pending"),
    finished = document.querySelector(".finished");

const PENDING_LS = "PENDING";
const FINISHED_LS = "FINISHED";

function filterFn (toDo) {
    return toDo.id === 1
}

let pendingArr = []; 
let finishedArr = [];

function deletePending (event) {
    const btn = event.target;
    const li = btn.parentNode;
    pending.removeChild(li);
    const cleanPending = pendingArr.filter(function(pending) {
        return pending.id !== parseInt(li.id);
    });
    pendingArr = cleanPending;
    savePending();
}

function deleteFinished (event) {
    const btn = event.target;
    const li = btn.parentNode;
    finished.removeChild(li);
    const cleanFinished = finishedArr.filter(function(finished){
        return finished.id !== parseInt(li.id);
    });
    finishedArr = cleanFinished;
    saveFinished();
}

function rewindFinished(event) {
    const rwdFin = event.path[1].outerText.slice(0,event.path[1].outerText.length-2);
    paintPending(rwdFin);
    deleteFinished(event);
}

function savePending(){
    localStorage.setItem(PENDING_LS, JSON.stringify(pendingArr));
}

function saveFinished(){
    localStorage.setItem(FINISHED_LS, JSON.stringify(finishedArr));
}

function paintPending(text){
    const li = document.createElement("li");
    const pendingSpan = document.createElement("span");
    pendingSpan.innerText = text;
    const finishBtn = document.createElement("button");
    finishBtn.innerText = "V";
    finishBtn.addEventListener("click", handleFinished);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.addEventListener("click", deletePending);
    const newId = pendingArr.length + 1;
    li.appendChild(pendingSpan);
    li.appendChild(finishBtn);
    li.appendChild(deleteBtn);
    li.id = newId;
    pending.appendChild(li);
    const pendingObj = {
        text: text,
        id: newId
    };
    pendingArr.push(pendingObj);
    savePending();
}

function paintFinished(text){
    const li = document.createElement("li");
    const finishedSpan = document.createElement("span");
    finishedSpan.innerText = text;
    const rewindBtn = document.createElement("button");
    rewindBtn.innerText = "<";
    rewindBtn.addEventListener("click", rewindFinished);
    const deleteFinishBtn = document.createElement("button");
    deleteFinishBtn.innerText = "X";
    deleteFinishBtn.addEventListener("click", deleteFinished);
    const newId = finishedArr.length + 1;
    li.appendChild(finishedSpan);
    li.appendChild(rewindBtn);
    li.appendChild(deleteFinishBtn);
    li.id = newId;
    finished.appendChild(li);
    const finishedObj = {
        text: text,
        id: newId
    };
    finishedArr.push(finishedObj);
    saveFinished();
}

function handleSubmit(event) {
    event.preventDefault();
    const currentPending = input.value;
    paintPending(currentPending);
    input.value = "";
}

function handleFinished(event){
    const currentFinished = event.path[1].outerText.slice(0,event.path[1].outerText.length-2);
    paintFinished(currentFinished);
    deletePending(event);
}

function loadPending(){
    const pending = localStorage.getItem(PENDING_LS);
    if(pending !== null) {
        const parsedPending = JSON.parse(pending);
        parsedPending.forEach(function(pending){
            paintPending(pending.text);
        });
    }
}

function loadFinished() {
    const finished = localStorage.getItem(FINISHED_LS);
    if(finished !== null) {
        const parsedFinished = JSON.parse(finished);
        parsedFinished.forEach(function(finished){
            paintFinished(finished.text);
        });
    }
}

function init(){
    loadPending();
    loadFinished();
    toDos.addEventListener("submit", handleSubmit)
}

init();