
const ALL = 0;
const ACTIVE = 1;
const COMPLETED = 2;
//--------------------------------------Model---------------------------------------------------------------------

var model = {
    list :[],
    initilize : function(){
        return this.list;
    },
    update : function(list){

    },
    delete : function(){

    }
}



//--------------------------------------View-----------------------------------------------------------------------

var view = {

    render : function(list,current){
        list.forEach(toDo => {
            let toDoNode = document.getElementById(toDo.id);
            let nonVisibilityClassName = 'display-none';

            if(current !== ALL && toDo.status !== current)
            {
                toDoNode.classList.add(nonVisibilityClassName);    
            }
            else
            {
                toDoNode.classList.remove(nonVisibilityClassName);
            }
            
            //console.log(toDo.status, current);
        })
        controller.displayToDosLeft();
        console.log(list);
    },




}


//--------------------------------------Controller-----------------------------------------------------------------

var controller = {
    current : ALL,
    list : [] ,
    initilize : function(){
        this.list = model.initilize() ;
        this.list.forEach(toDo => {
            this.createToDo(toDo);
        })
        view.render(this.list, this.current);

    },
    
    createToDoCheckBoxNode : function(){
        let checkBox = document.createElement('input') ;
        checkBox.setAttribute('type','checkbox') ;
        checkBox.onclick = this.toggleCheckBox ;

        return checkBox;
    },
    createToDoTaskNode : function(task){
        let toDoTask = document.createElement('li') ;
        toDoTask.innerText =  task ;
        toDoTask.ondblclick = this.editToDo;

        return toDoTask;

    },
    createToDoDeleteNode : function(){
        let deleteNode = document.createElement('li') ;
        deleteNode.innerText = ' X' ;
        deleteNode.onclick = this.deleteToDo;

        return deleteNode;
    },
    

    createDomNode : function(task,id){
        let toDo = document.createElement('ul') ;
        toDo.setAttribute('id',id) ;

        let checkBox = this.createToDoCheckBoxNode();
        let toDoTask = this.createToDoTaskNode(task);
        let deleteToDo = this.createToDoDeleteNode();

        toDo.appendChild(checkBox) ;
        toDo.appendChild(toDoTask) ;
        toDo.appendChild(deleteToDo) ;

        return toDo ;
    }, 
    createToDo : function(task){
        let newToDo = {
            status : ACTIVE ,
            task : task ,
            id : this.list.length, 
        }
        this.list.push(newToDo);

        let newNode = this.createDomNode(task, newToDo.id) ;
        let toDoList = document.getElementsByClassName('to-do-list')[0];
        toDoList.appendChild(newNode);

        model.update(this.list);
        view.render(this.list,this.current);


    },
    
    setCurrent : function(current){
        this.current = current;
        view.render(this.list, this.current);
    },
    displayToDosLeft : function(){
        let toDoLeft = document.getElementById('to-dos-left');
        let numberOfToDosLeft = this.list.filter(toDo => toDo.status === ACTIVE).length;

        toDoLeft.innerText = `${numberOfToDosLeft} remaining `;

    },
    deleteToDoFromList : function(id){
        let indexToDelete = controller.list.findIndex(toDo => toDo.id == id);
        controller.list.splice(indexToDelete, 1);
    },
    
    deleteToDoFromDom : function(id){
        let nodeToBeDeleted = document.getElementById(id);
        let parentNode = nodeToBeDeleted.parentNode;
        parentNode.removeChild(nodeToBeDeleted);
    },
    deleteToDoById : function(id)
    {
        controller.deleteToDoFromList(id);
        controller.deleteToDoFromDom(id);
        model.update(controller.list);
        view.render(controller.list, controller.current);
    },

    
    // --------------events handlers---------
    editToDo : function(event){
        let id = event.target.parentElement.id;
        console.log('double clicked to edit',event);
        let inputNode = document.createElement('input');
        inputNode.setAttribute('type','text');
        inputNode.classList.add('edit-to-do');
        inputNode.value = event.target.innerText;
        inputNode.onkeyup = controller.completeEditToDo;

        let parentNode = document.getElementById(id);
        parentNode.replaceChild(inputNode, event.target);

    },

    completeEditToDo : function(event){
        if(event.keyCode == 13)
        {
            console.log('enter pressed');
            let toDoTask = controller.createToDoTaskNode(event.target.value);
            let parentNode = event.target.parentElement;

            parentNode.replaceChild(toDoTask,event.target);

            if(event.target.value.trim() === '')
            {
                controller.deleteToDoById(parentNode.id);
            }
        }

    },

    toggleCheckBox : function(event){
        controller.list.forEach(toDo => {
            if(toDo.id == event.target.parentElement.id)
            {
                 console.log( event.target.parentElement.id);
                toDo.status = event.target.checked === true ? COMPLETED : ACTIVE ; 
            }
        })

        view.render(controller.list, controller.current);
        

    },

    deleteToDo : function(event){
        console.log('delete clicked');
        controller.deleteToDoById(event.target.parentElement.id);
    },
    

}

controller.initilize();

let toDoInput = document.getElementById('to-do-input') ;

toDoInput.onkeyup = function(event){
    if(event.keyCode == 13)
    {
        console.log('enter pressed',event.target.value);
        if(event.target.value.trim() !== '')
        {
            controller.createToDo(event.target.value);
        }
        event.target.value = '';
    }
}

let allSelector = document.getElementById('all');
let activeSelector = document.getElementById('active');
let completedSelector = document.getElementById('completed');

allSelector.onclick = function(){
    console.log(' all button clicked');
    controller.setCurrent(ALL);
}

activeSelector.onclick = function(){
    console.log(' active button clicked');
    controller.setCurrent(ACTIVE);
}

completedSelector.onclick = function(){
    console.log(' completed button clicked');
    controller.setCurrent(COMPLETED);
}