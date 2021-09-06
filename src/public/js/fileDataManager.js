function generateInfo (topic, content, language) {
    const checkbox = document.getElementById('switch').checked;
    const images = getImagesData(content);
    const selected = getSelectedImages();
    let newArrayImages = [];

    if(checkbox) newArrayImages = saveSelectedImages(images, selected);
    else if(!checkbox)  newArrayImages = deleteSelectedImages(images,selected);

    generateFile(topic, language, newArrayImages);
}

function getImagesData (content) {
    const array = content.split(',');

    return array;
}

function getSelectedImages () {
    const input = document.getElementsByName('images[]');
    const arraySelected = [];

    for (let i = 0; i < input.length; i++) {
        if(input[i].checked)
            arraySelected.push(input[i].value);
    }

    return arraySelected;
}

function deleteSelectedImages (images, selected) {
    const newArrayImages = [];

    for (let i = 0; i < images.length; i++) {
        if(!selected.includes(i.toString()))
            newArrayImages.push(images[i]); 
    } 
    return newArrayImages;
}

function saveSelectedImages (images, selected) {
    const newArrayImages = [];

    for (let i = 0; i < images.length; i++) {
        if(selected.includes(i.toString()))
            newArrayImages.push(images[i]); 
    } 
    return newArrayImages;
}

function generateFile (topic, language, info) {
    console.log('language is:' + language);
    const fileName = `${language} ${topic}.txt`;
    
    var blob = new Blob([info],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
}

function getImagesFromServer (content) {         
    const array = content.split(',');

    for (let i = 0; i < array.length; i++) 
        array[i] = array[i].replace(/¿/g,','); //-- Reconvert (¿) to (,) -->
    
    return array;
}

function printImages (array, divElement) {

    let html = '<ul>';
    for (let i = 0; i < array.length; i++) {
        html  += '<li><input type="checkbox" name="images[]" id="cb' + i + '" value="' + i + '" onchange="updateResultsAmount(`<%= aux %>`)"/>';
            html += '<label for="cb' + i + '"><img src="' + array[i] + '" /></label>';
        html += '</li>';
    }
    html += '</ul>';

    document.getElementById(divElement).innerHTML = html; //Prints the images
}

function updateResultsAmount() {
    const originalAmount = document.querySelectorAll('input[type="checkbox"]').length - 1; 
    const selectedAmount = document.querySelectorAll('input[type="checkbox"]:checked').length; //get the amount of all selected checkboxes on the page
    const checkbox = document.getElementById('switch').checked;
    let results = 0;

    if(checkbox) results = selectedAmount - 1;
    else results = originalAmount - selectedAmount;
    
    document.getElementById('results').innerHTML = `${results} results`;
}

