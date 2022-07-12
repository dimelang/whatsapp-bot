const socket = new WebSocket('ws://127.0.0.1:3000/');
const id_client = 'Client1'
let activeAccount = null;

const btn_add = document.getElementById('add-btn');
const modal_input = document.getElementById('input-modal');
const close_modal = document.getElementById('close-modal');
const add_account = document.getElementById("add_account");
const username_input = document.getElementById('username');
const desc_input = document.getElementById('description');
let counter_id = document.getElementById('profil-container').childElementCount;
const statusMessage = document.getElementById('status');
const qr_container = document.getElementById('qrcode');

const connect = () => {
    socket.onopen = function(){
        socket.send(JSON.stringify({
            'starting':id_client
        }));
    }
}

socket.onclose = (e) => {
    setTimeout(() => {
        connect();
    }, 1000);
}

socket.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    let key = Object.keys(data)[0];
    if(key == 'starting'){
        success()
        let account = Object.keys(data[key])[0];
        let container_profil = document.getElementById('profil-container');
        
        let x = {
            'id_account':data[key][account]['ket'],
            'desc_account':data[key][account]['desc']
        };
        
        counter_id+=1;
        let template = create_account_container(x,account.split("_")[1]);
        container_profil.appendChild(template);
    }else if(key == 'account'){
        waiting();
        activeAccount = data[key];
    }else if(key == 'message'){
        let currentAccount = document.getElementById(activeAccount);
        statusMessage.innerText = data[key];
        if(data[key] == 'Scan me!'){
            success()
            removeClass(qr_container, 'w-[35%] h-[35%]');
            addClass(qr_container, 'w-[28rem] h-[28rem]');
            qr_container.children[0].children[0].src = ''
            qr_container.style.display='block';
            qr_container.classList.add('reveal-container');
        }else if(data[key] == 'Terhubung ke Whatsapp'){
            removeClass(qr_container, 'w-[28rem] h-[28rem]');
            addClass(qr_container, 'w-[35%] h-[35%]');
            qr_container.children[0].children[0].src = './images/sukses.png'
            
            setTimeout(() => {
                onlineEffect(currentAccount.childNodes[1].childNodes[1].childNodes[0]);
                success()
            }, 500);   
        }
    }else if(key == 'account disconnect'){
        let disconnectAccount = data[key];
        let currentAccount = document.getElementById(disconnectAccount);
        if(currentAccount!=null){
            setTimeout(() => {
                offlineEffect(currentAccount.childNodes[1].childNodes[1].childNodes[1]);
                success()
            }, 1000);  
        }
    }else if(key == 'Delete'){
        let element = document.getElementById(data[key]);
        setTimeout(() => {
            success()
            element.remove();
        }, 1000);
    }else{
        success();
        qr_container.children[0].children[0].src = data[key]
    }

}

let sendCommand = (account,ket,desc,conn,cmd) => {
    socket.send(JSON.stringify({
        [cmd]:{
            [id_client]:{
                [account]:{
                    'ket':ket,
                    'desc':desc,
                    'connection':conn
                }
            }
        }
    }))
}

let set_attributes = (element,object) => {
    Object.keys(object).map(key => {
        let attribute = object[key].split(" ") ;
        if(attribute.length > 1){
            addClass(element,object[key])
        }else if(attribute.length == 1){
            attribute.forEach(val => {
                element.setAttribute(key,val)
            })
        }
    })
}

let addClass = (element,string) => {
    string.split(" ").forEach(val => {
        element.classList.add(val)
    })
}

let removeClass = (element,string) => {
    string.split(" ").forEach(val => {
        element.classList.remove(val)
    })
}

let waiting = () => {
    removeClass(document.body.children[0],'hidden');
    addClass(document.body.children[0],'fixed');
}

let success = () => {
    addClass(document.body.children[0],'hidden');
    removeClass(document.body.children[0],'fixed');
}

let create_account_container = (data,id) => {
    let main_container = document.createElement('div');
    set_attributes(main_container,{
        'class':'container w-[17rem] h-64 bg-[#ffffff] inline-block relative rounded-2xl shadow-qr-container p-3 reveal-container',
        'id':`account_${id}`
    });

    let delete_btn = document.createElement('div');
    set_attributes(delete_btn,{
        'id':'delete-account',
        'class':'z-10 rounded-full bg-red-600 h-7 w-7 absolute -top-4 shadow-closebtn-shadow flex justify-center place-items-center hover:bg-red-700 hover:cursor-pointer active:scale-50 text-white',
        'onclick':'deleteAccount(this)'

    })
    delete_btn.innerHTML+=`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
    stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>`;

    let con_controller = document.createElement('div');
    set_attributes(con_controller,{
        'class':'h-[25%] flex flex-row place-items-center rounded-2xl px-3 py-1 gap-2'
    });

    let con_status_img = document.createElement('div');
    set_attributes(con_status_img,{
        'class': 'hidden justify-center h-full w-2/12'
    });

    let btn_container = document.createElement('div');
    set_attributes(btn_container,{
        'class':'rounded-md bg-white w-full h-4/6 flex flex-row justify-center'
    });

    let connect_btn = document.createElement('button');
    set_attributes(connect_btn,{
        'id':'connect',
        'class':'border rounded-l-md w-full flex justify-center items-center hover:cursor-pointer hover:bg-[#e3ffe7] transition duration-150 ease-out focus:ease-in p-1',
        'onclick':'con_or_discon(this)'
    })

    let icon_on = document.createElement('img');
    set_attributes(icon_on,{
        'src':'./images/play.png',
        'class':'h-4/6 w-auto'
    })
    connect_btn.appendChild(icon_on)

    let disconnect_btn = document.createElement('button');
    set_attributes(disconnect_btn,{
        'id':'disconnect',
        'class':'border rounded-r-md w-full flex justify-center items-center pointer-events-none hover:cursor-pointer hover:bg-[#ffe3e3] transition duration-150 ease-out focus:ease-in p-1',
        'onclick':'con_or_discon(this)'
    });
    
    let icon_off = document.createElement('img');
    set_attributes(icon_off,{
        'src':'./images/pause.png',
        'class':'h-4/6 w-auto'
    })
    disconnect_btn.appendChild(icon_off);

    btn_container.appendChild(connect_btn);
    btn_container.appendChild(disconnect_btn);

    con_controller.appendChild(con_status_img);
    con_controller.appendChild(btn_container);

    main_container.appendChild(delete_btn);
    main_container.appendChild(con_controller);

    let desc_section = document.createElement('div');
    set_attributes(desc_section,{
        'class': 'h-[75%] bg-white p-3'
    });

    let desc_container = document.createElement('div');
    if(data['desc_account'].length > 15){
        set_attributes(desc_container,{
            'class':'h-full flex flex-row flex-wrap justify-start overflow-auto'
        });
    }else{
        set_attributes(desc_container,{
            'class':'h-full flex flex-col flex-wrap justify-start overflow-auto'
        });
    }

    let id_account = document.createElement('p');
    set_attributes(id_account,{
        'id':'name_account',
        'class':'font-Comfortaa text-left text-l font-bold text-slate-700 mt-2'
    });
    id_account.innerText = data['id_account'];
    
    let desc_account = document.createElement('p');
    set_attributes(desc_account,{
        'id':'desc_account',
        'class':'italic text-slate-500 block text-center mt-2'
    });
    desc_account.innerText = data['desc_account'];

    desc_container.appendChild(id_account);
    desc_container.appendChild(desc_account);

    desc_section.appendChild(desc_container);

    main_container.appendChild(desc_section);
    return main_container
}

let onlineEffect = (target) => {
    
    let main_container = target.parentElement.parentElement.parentElement;
    addClass(target,'con-active');
    addClass(main_container,'rounded-t-none border-t-4 border-green-300 shadow-lg shadow-active_shadow');

    setTimeout(() => {
        removeClass(target.nextElementSibling, 'pointer-events-none');
        addClass(target.nextElementSibling,'hover:bg-[#ffe3e3]')
    }, 1000);
    

    qr_container.style.display='none';
    qr_container.classList.remove('reveal-container');
    statusMessage.innerText = '';
}

let offlineEffect = (target) => {
    let status_conn = target.parentElement.previousElementSibling;
    let svg_discon = svg.disconnect;
    status_conn.innerHTML='';
    status_conn.innerHTML+=svg_discon;

    let main_container = target.parentElement.parentElement.parentElement;
    removeClass(target.previousElementSibling,'con-active');
    removeClass(target, 'hover:bg-[#ffe3e3] hover:cursor-pointer');
    addClass(target,'pointer-events-none')
    removeClass(main_container,'border-green-300 shadow-active_shadow');

    addClass(target,'disc-active');
    removeClass(target.previousElementSibling, 'pointer-events-none');
    addClass(target.previousElementSibling,'hover:bg-[#e3ffe7] hover:cursor-pointer');
    addClass(main_container,'border-red-300 shadow-deactive_shadow');
    

}

let connect_helper = (target) => {
    let parentContainer = target.parentElement.parentElement
    let account_id = parentContainer.parentElement.id
    let accountContainer = parentContainer.nextElementSibling
    let allDescAccount = accountContainer.firstChild.querySelectorAll('p')
    let cmd = target.id;

    sendCommand(account=account_id,ket=allDescAccount[0].innerText,desc=allDescAccount[1].innerText,true,cmd);
    waiting()

    let svg_conn = svg.connect;
    let main_container = target.parentElement.parentElement.parentElement;
    removeClass(target.nextElementSibling,'disc-active');
    removeClass(target, 'hover:bg-[#e3ffe7] hover:cursor-pointer');
    addClass(target,'pointer-events-none')
    removeClass(main_container,'border-red-300 shadow-qr-container shadow-deactive_shadow');
    

    let status_conn = target.parentElement.previousElementSibling;
    status_conn.classList.remove('hidden');
    status_conn.classList.add('flex');
    status_conn.innerHTML = '';
    status_conn.innerHTML+=svg_conn;

    qr_container.style.display='none';
    qr_container.classList.remove('reveal-container');
}

let disconnect_helper = (target) => {
    let parentContainer = target.parentElement.parentElement
    let account_id = parentContainer.parentElement.id
    let accountContainer = parentContainer.nextElementSibling
    let allDescAccount = accountContainer.firstChild.querySelectorAll('p')
    let cmd = target.id;

    sendCommand(account=account_id,ket=allDescAccount[0].innerText,desc=allDescAccount[1].innerText,false,cmd);
    waiting()

    let main_container = target.parentElement.parentElement.parentElement;
    removeClass(target.previousElementSibling,'con-active');
    removeClass(target, 'hover:bg-[#ffe3e3] hover:cursor-pointer');
    addClass(target,'pointer-events-none')
    removeClass(main_container,'border-green-300 shadow-active_shadow');
    let svg_discon = svg.disconnect;

    let status_conn = target.parentElement.previousElementSibling;
    status_conn.innerHTML='';
    status_conn.innerHTML+=svg_discon;

    qr_container.style.display='none';
    qr_container.classList.remove('reveal-container');
}

let con_or_discon = (event) => {
    event.id == 'connect' ? connect_helper(event) : disconnect_helper(event)
}

let deleteAccount = (event) => {
    let parent = event.parentElement;
    let akun = parent.children[2].children[0].children[0].innerText;
    let desc = parent.children[2].children[0].children[1].innerText;

    sendCommand(account=parent.id,ket=akun,desc=desc,false,'delete');
    waiting()

    
}

btn_add.onclick = () => {
    modal_input.classList.remove('hidden');
}

modal_input.onclick = (event) => {
    if (event.target.id == 'input-modal') {
        clear_modal();
    }
}

close_modal.onclick = () => {
    clear_modal();
}

add_account.onclick = () => {
    let input_isnull = null_Validation([username_input, desc_input]);
    if (input_isnull == 0) {
        counter_id += 1;
        let data = {
            'id_account':username_input.value.replace(username_input.value.slice(0,1),username_input.value.slice(0,1).toUpperCase()),
            'desc_account':desc_input.value.replace(desc_input.value.slice(0,1),desc_input.value.slice(0,1).toUpperCase())
        };

        let container_profil = document.getElementById('profil-container');
        let template = create_account_container(data,counter_id);

        sendCommand(account=template.id,ket=data['id_account'],desc=data['desc_account'],false,'starting');

        modal_input.classList.add('hidden');
        container_profil.appendChild(template);
        username_input.value = '';
        desc_input.value = '';
        setTimeout(() => {
            container_profil.lastChild.classList.remove('reveal-container')
        }, 1005);
    } else {
        let toast = document.getElementById('toast');
        toast.classList.remove('opacity-0');
        toast.classList.add('toast-animation');
        setTimeout(() => {
            toast.classList.add('opacity-0')
            toast.classList.remove('toast-animation');
        },4950);
    }
}

let clear_modal = () => {
    for (let e of [username_input,desc_input]) {
        e.classList.remove('border-pink-500');
        e.value = '';
    }
    modal_input.classList.add('hidden');
}

let null_Validation = (elem) => {
    let counter_true = 0;
    for (let e of elem) {
        if (e.value.length == 0) {
            e.classList.add('border-pink-500');
            counter_true += 1;
        } else {
            e.classList.remove('border-pink-500');
        }
    }
    return counter_true;
}

connect();