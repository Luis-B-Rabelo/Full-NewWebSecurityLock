function openClose()
{
    let lock_id = document.getElementById("lock-id").textContent;

    let last_action = document.getElementById("open-close").value;

    let new_action;

    console.log(last_action);

    if(last_action == 1)
    {
        new_action = false;
    }
    else
    {
        new_action = true;
    }

    const XHTTP = new XMLHttpRequest();

    XHTTP.onload = () =>
    {
        if(XHTTP.responseText == "true")
        {
            //refreshLocks();
        }
    }

    XHTTP.open("POST", "http://192.168.56.1:3000/new_action");
    XHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHTTP.send(`lock_id=${lock_id}&new_action=${new_action}`);

}

function refreshLocks()
{
    let account_id = document.getElementById("ID").textContent;

    const XHTTP = new XMLHttpRequest();

    XHTTP.onload = () =>
    {
        location.reload();
    }

    XHTTP.open("POST", "http://192.168.56.1:3000/refresh_locks");
    XHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHTTP.send(`account_id=${account_id}`);
}

setInterval(refreshLocks, 5000);