var xhr = new XMLHttpRequest();
var clientId = 'z3PC0R7c9QUP9GqOXffK';
var clientSecret = 'DKRegT6p7Z';
var div_list_arr = [];

function onWindowLoad() {
  document.getElementById("search").addEventListener("click", search_movie);
}

function search_movie() {
  var query = document.getElementById('query').value;

  xhr.open("GET", 'https://openapi.naver.com/v1/search/movie.json'
    + '?query=' + encodeURI(query), true);
  xhr.setRequestHeader("X-Naver-Client-Id", clientId);
  xhr.setRequestHeader("X-Naver-Client-Secret", clientSecret);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (chrome.extension.lastError) {
      document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
    } else {

      if (xhr.readyState == 4 && this.status == 200) {
        resp = this.response;
        if (resp !== undefined) {
          obj = JSON.parse(resp);

          for (i = 0; i < obj.display; i++) {
            var tempDiv = document.createElement("div");
            var keyName = 'list';
            tempDiv.id = 'filter' + i;
            tempDiv.innerHTML = '제목 :' + '<a href=""' + obj.items[i].title + '<a/>'
              + '<br/>' + '개봉년도 : ' + obj.items[i].pubDate + '<br/>'
              + '감독 : ' + obj.items[i].director + '<br/>'
              + '배우 : ' + obj.items[i].actor
              + '<br/>' + '<br/>';
            tempDiv.onclick = function () {
              var index = Number(this.id.substring(6));
              var tempJSON = JSON.stringify(obj.items[index]);
              chrome.storage.local.get({ filter: [] }, function (result) {
                var filterList = result.filter;
                filterList.push(tempJSON);
                chrome.storage.local.set({ filter: filterList }, function () {
                  chrome.storage.local.get('filter', function (result) {
                    console.log(result.filter)
                  });
                });
              }); 
            }
            document.body.appendChild(tempDiv);
          }
          
        }
      }
    }
  }
}
window.onload = onWindowLoad;
