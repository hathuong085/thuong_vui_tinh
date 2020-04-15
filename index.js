var dashboard = dashboard || {};

dashboard.drawTable = function () {
    $.ajax({
        url: "http://localhost:3000/products",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#show').empty();
            let id = 1;
            $.each(data, function (i, v) {
                $('#show').append(
                    "<div class='col-md-4 col-sm-6 portfolio-item'>" +
                    "<a class='portfolio-link' data-toggle='modal' href='#portfolioModal'>" +
                    "<div class='portfolio-hover'>" +
                    "<div class='portfolio-hover-content'>" +
                    "<i  class='fas fa-plus fa-3x' onclick='dashboard.Modal(" + v.id + ")'></i >" +
                    "</div>" +
                    "</div>" +
                    "<img class='img-fluid' src='" + v.productImage + "'>" +
                    "</a>" +
                    "<div class='portfolio-caption'>" +
                    "<h4>" + v.productName + "</h4>" +
                    "<p class='text-muted'>" + v.color + "</p>" +


                    "</div>" +
                    "</div>"
                );
            })
        }
    });
}
dashboard.drawgiohang = function () {
    id = $('#kiemtra').val();
    $.ajax({
        url: "http://localhost:3000/khachhang/" + id,
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#modalgiohang').find('#tenkhachhang').text(data.tenkh);
           
            $("#modalgiohang").modal('show');
        }
    })


}
dashboard.check = function () {
    let tendnkh = $('#tendnkh').val();
    let pass = $('#pass').val();
    let isLogged = false;
    $.ajax({
        url: "http://localhost:3000/khachhang",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, v) {
                if (v.tentk == tendnkh && v.pass == pass) {
                    isLogged = true;
                    $("#modaldangnhap").modal('hide');
                    $('#cartId').val(v.id);
                    console.log($('#cartId').val())
                    $('#kiemtra').val(v.id);
                    sodh = v.donhang;
                    stt = sodh.length;
                    $('#sosanpham').val(stt);
                    $('#cart').find('#sosanpham').text(stt);
                    dashboard.showragio();
                    dashboard.drawgiohang();
                }
            })
            if (!isLogged) {
                $('#danhnhapsai').removeClass('d-none');
            }
        }

    });
}
dashboard.showgiohang = function () {
    if ($('#kiemtra').val() == 0) {
        dashboard.resetformdn();
        $("#modaldangnhap").modal('show');

    } else {
        dashboard.showragio();
        dashboard.drawgiohang();
    }
}
dashboard.taotaikhoan = function () {
    $("#modaldangky").modal('show');
    $("#modaldangnhap").modal('hide');

}
dashboard.dangky = function () {

    if ($('#formtaotk').valid()) {
        var donhag = Array();
        var khm = {};
        khm.ten = $('#hoten').val();
        khm.tentk = $('#taotendnkh').val();
        khm.pass = $('#taopass').val();
        khm.sdt = $('#sdtkh').val();
        khm.donhang = donhag;
        khm.diachi = $('#dckh').val();
    }
    $.ajax({
        url: "http://localhost:3000/khachhang",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(khm), //chuyển addoject thành chuỗi
        success: function (data) {
            $("#modaldangky").modal('hide');
            $("#modaldangnhap").modal('show');
        }
    })

}

dashboard.buyproduct = function () {
    $('#showsp').modal('hide');
    bootbox.confirm({
        title: "Mua hàng",
        message: "Bạn có chắc chắn muốn mua sản phầm này không?",
        buttons: {
            confirm: {
                label: '<i class="fa fa-check"></i> Có'
            },
            cancel: {
                label: '<i class="fa fa-times"></i> Không'
            }


        },
        callback: function (result) {
            if (result) {
                id = $('#productId').val();
                $.ajax({
                    url: "http://localhost:3000/products/" + id,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        ten = data.productName;
                        mau = data.color;
                        gia = data.price;
                        hanh = data.productImage;
                        nsx = data.manufactory;
                        var donhangmoi = [ten, mau, gia, hanh, nsx];
                        console.log(donhangmoi)

                        idkh = $('#cartId').val();
                        $.ajax({
                            url: "http://localhost:3000/khachhang/" + idkh,
                            method: "GET",
                            dataType: "json",
                            success: function (data1) {
                                themdh = data1.donhang;
                                themdh.push(donhangmoi);
                                console.log(themdh)
                                var them = {};
                                them.ten = data1.ten;
                                them.tentk = data1.tentk;
                                them.pass = data1.pass;
                                them.sdt = data1.sdt;
                                them.diachi = data1.diachi;
                                them.id = data1.id;
                                them.donhang = themdh;
                                $.ajax({
                                    url: "http://localhost:3000/khachhang/" + idkh,
                                    method: "PUT",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify(them),
                                })
                                ssp = $('#sosanpham').val();
                                ssp++;
                                $('#sosanpham').val(ssp);
                                $('#cart').find('#sosanpham').text(ssp);
                            }
                        })
                    }
                })
            }
            else {
                $('#showsp').modal('show');
            }
        }
    });
}
dashboard.Modal = function (id) {
    $.ajax({
        url: "http://localhost:3000/products/" + id,
        method: "GET",
        dataType: "json",
        success: function (data) {
            document.getElementById("img").setAttribute('src', data.productImage);
            $('#showsp').find('#name').text(data.productName);
            $('#showsp').find('#color').text(data.color);
            $('#showsp').find('#price').text(data.price);
            $('#showsp').find('#mft').text(data.manufactory);
            $('#showsp').find('#dct').text(data.description);
            $('#productId').val(data.id);
            console.log($('#productId').val());
            $('#showsp').modal('show');

        }
    });

}
dashboard.dangxuat = function () {
    bootbox.confirm({
        title: "Đăng xuất",
        message: "Bạn có chắc chắn muốn đăng xuất không?",
        buttons: {
            confirm: {
                label: '<i class="fa fa-check"></i> Có'
            },
            cancel: {
                label: '<i class="fa fa-times"></i> Không'
            }


        },
        callback: function (result) {
            if (result) {
                $('#kiemtra').val("0");
                $("#modalgiohang").modal('hide');
                $('#sosanpham').val("0");
                $('#cart').find('#sosanpham').text("0");
            }
        }
    });
}
dashboard.showragio=function(){
    idkh = $('#cartId').val();
    $.ajax({
        url: "http://localhost:3000/khachhang/" + idkh,
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#showra').empty();
            sodonhang=data.donhang;
            stt=0;
            for (let i=0;i<sodonhang.length;i++){
                stt++;
                $('#showra').append(
                    "<tr>"+
                    "<td>"+stt+"</td>"+
                    "<td>"+sodonhang[i][0]+"</td>"+
                    "<td>"+"<img src='"+sodonhang[i][3]+"' width='100px' heigth='150px'> "+"</td>"+
                    "<td>"+sodonhang[i][1]+"</td>"+
                    "<td>"+sodonhang[i][4]+"</td>"+
                    "<td>"+sodonhang[i][2]+"</td>"+
                    "</tr>"
                )
            }
        }
    })
}
dashboard.resetformdn = function () {
    $('#tendnkh').val('');
    $('#pass').val('');
}
dashboard.init = function () {
    dashboard.drawTable();
};
$(document).ready(function () {
    dashboard.init();
});