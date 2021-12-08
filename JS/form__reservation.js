function editRoom() {
    window.history.back();
}
alert("Vui lòng điền thông tin và thanh toán trong thời gian 10 phút. Nếu quá thời gian này chúng tôi sẽ chuyển bạn về trang chọn phòng")
//Lấy thông tin về thời gian và phòng trong sessionStorage
var timeDetails = JSON.parse(sessionStorage.getItem("timeDetails"));
var roomDetails = JSON.parse(sessionStorage.getItem("roomDetails"));

//Gán thời gian lên thanh chỉnh phòng và chỗ thông tin đặt phòng
document.getElementById("arrive").innerText = new Date(timeDetails[0]).toLocaleDateString();
document.getElementById("depart").innerText = new Date(timeDetails[1]).toLocaleDateString();

document.getElementById("time").innerText = new Date(timeDetails[0]).toLocaleDateString() + " - " + new Date(timeDetails[1]).toLocaleDateString();;
document.getElementById("roomsnumber").innerText = roomDetails.length;

//Khai báo biến dùng để định dạng tiền tệ
var formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'VND',
})

//Thêm thông tin phòng vào bảng thông tin đặt phòng
var rooms__container = document.getElementsByClassName("rooms__container")[0];
for (let i = 0; i < roomDetails.length; i++) {
    var roomItem = document.createElement('div');
    roomItem.classList.add('form__row');
    roomItem.innerHTML = '<p class="form__item">Phòng ' + (i + 1).toString() + ': ' + roomDetails[i].roomTitle + '</p> <p id="money">' + formatter.format(roomDetails[i].roomPrice) + '</p>'
    rooms__container.append(roomItem);
}

//Tính tổng tiền và cho hiển thị ở bảng thông tin
var total = 0;
roomDetails.forEach((value, index, origin) => {
    total += value.roomPrice;
});
document.getElementById("total").innerHTML = "<b>" + formatter.format(total) + "</b>";


// Đếm thời gian giữ phòng

// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     const interval = setInterval(function () {
//         minutes = parseInt(timer / 60);
//         seconds = parseInt(timer % 60);
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.innerText = minutes + ":" + seconds;
//         if (timer==0) {
//             clearInterval(interval);
//             alert("Đã hết thời gian");
//             window.history.back();
//             ////Thêm code trả về trang ban đầu
//         }
//         timer--;
//     }, 1000);
// }

// window.onload = function () {
//     var tenMinutes = 60,
//         display = document.getElementById('countdown');
//     startTimer(tenMinutes, display);
// };

//Chỗ điền thông tin khách hàng
var form = document.getElementById("form--reservation"),
    lastname = document.getElementById("lastname"),
    firstname = document.getElementById("firstname"),
    phonenumber = document.getElementById("phonenumber"),
    email = document.getElementById("email"),
    address = document.getElementById("address"),
    paymentMethod = document.getElementById("paymethod"),
    comment = document.getElementById("comment"),
    result = document.getElementById("result");
var existingBookingInfo = sessionStorage.getItem("bookingInfo"),
    existingCustomerInfo = sessionStorage.getItem("customerInfo");
existingBookingInfo = existingBookingInfo ? JSON.parse(existingBookingInfo) : [];
existingCustomerInfo = existingCustomerInfo ? JSON.parse(existingCustomerInfo) : [];
console.log(existingCustomerInfo);

function getCustomerData() {
    let phone = document.getElementById("phone");
    for (let i = 0; i < existingCustomerInfo.length; i++) {
        if (existingCustomerInfo[i].phone == phone.value) {
            lastname.value = existingCustomerInfo[i].lastname;
            firstname.value = existingCustomerInfo[i].firstname;
            phonenumber.value = existingCustomerInfo[i].phone;
            email.value = existingCustomerInfo[i].email;
            address.value = existingCustomerInfo[i].address;
            $("#myForm").modal("hide");
            break;
        }
        else {
            result.innerText = "Không tìm thấy dữ liệu"
        }
    }
}


form.addEventListener('submit', function (event) {
    event.preventDefault();
    let newBookingInfo = {
        id: 100000+existingBookingInfo.length + 1,
        lastname: lastname.value,
        firstname: firstname.value,
        phone: phonenumber.value,
        email: email.value,
        address: address.value,
        paymentMethod: paymentMethod.value,
        bookTime: new Date(),
        timeInfo: timeDetails,
        roomInfo: roomDetails,
        totalAmount: total,
        bookingStatus: "paid",
        // discount: discountDetails,
        feedback: ""
    }
    existingBookingInfo.push(newBookingInfo);
    sessionStorage.setItem("bookingInfo", JSON.stringify(existingBookingInfo));

    //Thêm hàm check xem customer đó đã có trong data chưa
    var isNotExisted = true;
    for (let i = 0; i < existingCustomerInfo.length; i++) {
        if (existingCustomerInfo[i].phone == phonenumber.value) {
            isNotExisted = false;
            break;
        }
    }
    if (isNotExisted) {
        let newCustomerInfo = {
            id: existingCustomerInfo.length + 1,
            lastname: lastname.value,
            firstname: firstname.value,
            phone: phonenumber.value,
            email: email.value,
            address: address.value
        }
        existingCustomerInfo.push(newCustomerInfo);
        sessionStorage.setItem("customerInfo", JSON.stringify(existingCustomerInfo));
    }
    sessionStorage.removeItem("timeDetails");
    sessionStorage.removeItem("roomDetails");
    sessionStorage.setItem("findBookingInfoCode",newBookingInfo.id.toString());
    window.location.assign("BookingInfo.html");

})
// existing.push(bookingInfo);
// sessionStorage.setItem("bookingInfo", JSON.stringify(existing));
