const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value
    //Validate Input
    if (newItem === '') {
        alert('Please Add an Item')
        return;
    }

    //Check for edit Mode
    if (isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-Mode');
        itemToEdit.remove();
        isEditMode = false;
    } else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }

    addItemToDOM(newItem);

    addItemToStorage(newItem);

    //itemInput.value = '';
    checkUI();
    itemInput.value ='';
}

function addItemToDOM(item){
//Create List Item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function addItemToStorage(item){

    let itemsFromStorage = getItemsFromStorage();

    //Add ne wItem to Array
    itemsFromStorage.push(item);

    //Convert to JSON string and set to local storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage  = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode') )
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;

}

function removeItem(item){
    if(confirm('Are You Sure?')){
        //Remove from DOM
        item.remove();

        //Remove from Storage
        removeItemFromStorage(item.textContent)
        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item)

    //Re-set to localstorage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage))
}

function clearItems(){
    itemList.innerHTML = '';
    checkUI();

    //Clear fromLocalStorage
    localStorage.removeItem('items');
}

function checkUI(){
    itemInput.value = '';
    const items = document.querySelectorAll('li');
    if(items.length === 0) {
        filter.style.display = 'none';
        clearBtn.style.display = 'none';
    } else {
        filter.style.display = 'block';
        clearBtn.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;

}

function filterItems(e){
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) !== -1) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

//Event Listeners

itemForm.addEventListener('submit',addItem);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItems);
filter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayItems);
checkUI();


