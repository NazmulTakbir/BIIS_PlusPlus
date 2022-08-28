function setTodayAsMinDate(dateElementID){
    var today = new Date();
    var dd = today.getDate(), mm = today.getMonth()+1, yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd    
    if(mm<10) mm='0'+mm
    today = yyyy+'-'+mm+'-'+dd;

    var elms = document.querySelectorAll("[id='date']");
    for(var i = 0; i < elms.length; i++) 
      elms[i].setAttribute("min", today);
};

exports.setTodayAsMinDate = setTodayAsMinDate;