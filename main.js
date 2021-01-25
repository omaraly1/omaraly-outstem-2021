var searchDisplay = document.getElementById('list');
var wasteDisplay = document.getElementById('trash');
var realData = [];
var mainList = [];
var wasteList = [];
var temp = [];
var count = 6;
var startSearch = 0;
var nextSearch = 0;

//mapping the category in the JSON dataset to the appropriate bins, which is used in displaying the waste bins
var mapping = {
    "Blue Bin": {
        "bin": "bin2",
        "image": "assets/bluebin.png"
    },
    "Black Bin": {
        "bin": "bin2",
        "image": "assets/blackbin.png"
    },
    "Green Bin": {
        "bin": "bin3",
        "image": "assets/greenbin.png"
    },
    "Depot": {
        "bin": "bin1",
        "image": "assets/garbagebin.png"
    },
    "Metal Items": {
        "bin": "bin1",
        "image": "assets/garbagebin.png"
    },
    "Garbage": {
        "bin": "bin1",
        "image": "assets/garbagebin.png"
    },
    "Oversize": {
        "bin": "bin1",
        "image": "assets/garbagebin.png"
    },
    "Not Accepted": {
        "bin": "",
        "image": "assets/no.png"
    },
    "Electronic Waste": {
        "bin": "bin1",
        "image": "assets/garbagebin.png"
    },
    "HHW": {
        "bin": "bin4",
        "image": "assets/hazard.png"
    },
    "Yard Waste": {
        "bin": "bin3",
        "image": "assets/yardwaste.png"
    }
}



//given a keyword, start index, and how many results to display, this function returns an array containing the results
function search(keyword, start, count) {

    var results = [];

    var num = 0;
    var i = start;

    startSearch = start;

    keyword = keyword.toLowerCase();

    while (i < mainList.length && num < count) {

        if (mainList[i].keyword.toLowerCase().startsWith(keyword)) {

            results.push({
                "item": mainList[i],
                "indexInMain": i
            });

            nextSearch = i + 1;

            num++;
        }
        i++;
    }



    return results;
}


//function that is called every time a key is pressed in the search bar
function keySearch() {
    nextSearch = 0;
    var query = $('#search').val();
    displaySearch(search(query, 0, count), realData, query);
}


//moves item from one data list to another
function moveItem(indexToMove, source, destination) {

    var temp;
    var added = false;

    temp = source[indexToMove];
    source.splice(indexToMove, 1);

    if (destination == mainList) {

        for (var i = 0; i < mainList.length; i++) {
            if (temp.keyword <= mainList[i].keyword) {
                destination.splice(i, 0, temp);
                console.log(i);
                added = true;
                break;
            }
        }

        if (!added) {
            destination.splice(0, 0, temp);
        }



    } else {

        destination.push(temp);
    }

    return;
}


//generates the main data list, which includes the item (keyword) and the index in the provided JSON dataset to allow for proper insertion when being moved
function createMainList(data) {

    var indexInJSON = 0;

    for (var i = 0; i < data.length; i++) {

        temp = data[i].keywords.split(", ");

        for (var j = 0; j < temp.length; j++) {

            mainList.push({
                "keyword": temp[j],
                "indexInData": indexInJSON
            });
        }

        indexInJSON++;

    }

    mainList.sort(compare);

    return;
}

//displays search resutls in a formatted way
function displaySearch(results, data, query) {

    $("#list").html("");

    if (query.length == 0) {

        $("#list").html("");
        $("#load").hide();

    } else {

        console.log(results);

        for (var i = 0; i < results.length && i < count - 1; i++) {

            row = document.createElement('div');
            row.className = "row";

            label = document.createElement('div');
            label.className = "col-sm";

            body = document.createElement('div');
            body.className = "col-6";

            action = document.createElement('div');
            action.className = "col-sm";

            itemName = document.createElement('div');
            itemName.className = "row";

            icon = document.createElement('div');
            icon.className = "row";

            name = results[i].item.keyword;
            itemName.innerHTML = name.toUpperCase();
            itemName.setAttribute("id","itemDisplay");
            label.appendChild(itemName);

            photo = document.createElement("img");
            photo.setAttribute("id", "logo");
            path = mapping[data[results[i].item.indexInData].category].image;
            photo.setAttribute("src", path);

            icon.appendChild(photo);
            label.appendChild(icon);

            row.appendChild(label);

            content = $('<textarea />').html(data[results[i].item.indexInData].body).text();
            body.innerHTML = content;
            row.appendChild(body);

            button = document.createElement('button');
            button.className = "btn btn-success";
            button.setAttribute("type", "button");
            button.setAttribute("onclick", "handleAddButton(" + results[i].indexInMain + ",'" + query + "')");
            button.innerHTML = "Add";

            category = data[results[i].item.indexInData].category;

            if (category == "Not Accepted") {
                button.disabled = true;
            }

            action.appendChild(button);


            row.appendChild(action);

            space = document.createElement('br');

            searchDisplay.appendChild(row);
            searchDisplay.appendChild(space);

        }

        if (results.length == count) {
            $('#load').show();
            $('#load').attr("onclick", "loadMore('" + query + "')");

        } else {
            $('#load').hide();
        }
    }

    return;

}


//function called when load more button is pressed
function loadMore(query) {
    var results = search(query, nextSearch, count);
    displaySearch(results, realData, query);
}

function displayWaste(wasteList, mapping, realData, query) {

    $("#bin1").html("");
    $("#bin2").html("");
    $("#bin3").html("");
    $("#bin4").html("");


    for (var i = 0; i < wasteList.length; i++) {

        indexInMapping = realData[wasteList[i].indexInData].category;

        binID = mapping[indexInMapping].bin;

        bin = document.getElementById(binID);

        div = document.createElement('div');

        name = wasteList[i]["keyword"];

        nameSpan = document.createElement('span');
        nameSpan.innerHTML = name.toUpperCase() + " ";
        nameSpan.setAttribute("padding", "5px");
        nameSpan.setAttribute("id","itemDisplay");
        div.appendChild(nameSpan);

        buttonSpan = document.createElement('span');
        button = document.createElement('button');
        button.className = "btn btn-danger btn-sm";
        button.setAttribute("type", "button");
        button.setAttribute("onclick", "handleRemoveButton(" + i + ",'" + query + "')");
        button.innerHTML = "X";
        buttonSpan.appendChild(button);

        div.appendChild(buttonSpan);

        bin.appendChild(div);
    }



    return;

}

//moves item to waste list, and refreshes both search and waste 
function handleAddButton(indexToMove, query) {

    moveItem(indexToMove, mainList, wasteList);
    var results = search(query, startSearch, count);

    displaySearch(results, realData, query);
    displayWaste(wasteList, mapping, realData, query);



    return;

}

//function called when 'x' is pressed on an item in a waste bin and moves item back to main list

function handleRemoveButton(indexToMove, query) {

    moveItem(indexToMove, wasteList, mainList);
    var results = search(query, startSearch, count);
    displaySearch(results, realData, query);
    displayWaste(wasteList, mapping, realData, query);



    return;

}

//object array sort

function compare(a, b) {
    if (a.keyword < b.keyword) {
        return -1;
    }
    if (a.keyword > b.keyword) {
        return 1;
    }
    return 0;
}

//get data and create main list

$.getJSON('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000', function(data) {

    realData = data;
    createMainList(realData);
});
        