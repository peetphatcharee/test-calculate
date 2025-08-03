const api = "https://sopon007.github.io/sample.github.io/test.json";



function calculate() {


    const inputValue = parseFloat(document.getElementById("input").value);
    console.log("Input value:", inputValue);
    if (isNaN(inputValue) || inputValue > 1000) return alert("กรุณาใส่จำนวนเงินไม่เกิน 1000 บาท");

    fetch(api).then(response => response.json()).then(data => {
        console.log("Data fetched successfully:", data);
        getData(data, inputValue);
    }).catch(error => {
        console.error("Error fetching data:", error);
    });

}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH");
}

function getData(data, inputValue) {
    const table = document.getElementById("resultTable");
    const empty = document.getElementById("emptyMessage");
    const resultBody = document.getElementById("resultBody");
    const resultTotal = document.getElementById("resultTotal");
    resultBody.innerHTML = "";


    table.style.display = "block";
    empty.style.display = "none";
    let remaining = inputValue;  // เงินคงเหลือ

    let total = 0;                           // ราคาปลาทั้งหมดก่อนลด
    let discount = 0;                        // ส่วนลดรวม
    let rows = "";                           // HTML สำหรับ tbody
    let salmonCount = 0;                     // จำนวนปลาแซลมอนที่ซื้อได้


    const resultArr = [];

    const filterData = data.filter(f => new Date(f.detail.expired) >= new Date())
        .sort((a, b) => b.detail.price - a.detail.price);

    filterData.forEach((fish) => {
        const price = fish.detail.price;
        const qtyAvailable = fish.detail.quantity;
        let buyQty = 0;
        let itemTotal = 0;
        let itemDiscount = 0;

        buyQty = Math.min(Math.floor(remaining / price), qtyAvailable);
        itemTotal = buyQty * price;
        remaining -= itemTotal; // หักเงิน
        total += itemTotal;     // รวมเข้าราคารวม

        // ถ้าเป็นปลาแซลมอน เก็บจำนวนไว้ตรวจส่วนลด
        if (fish.name.includes("แซลม่อน")) {
            salmonCount = buyQty;
        }

        // เงื่อนไขส่วนลด: ปลาแซลมอน ≥ 2 ตัว ลด 20 บาท
        if (fish.name.includes("แซลม่อน") && buyQty >= 2) {
            itemDiscount = 20;
            discount += 20;
        }

        // สร้างแถว HTML แสดงผลปลาแต่ละชนิด
        rows += `<tr class="${expired ? 'expired' : ''}">
          <td>${fish.name}</td>
          <td>${expired ? 0 : buyQty}</td>
          <td>${expired ? 0 : itemTotal} บาท</td>
          <td>${expired ? '-' : itemDiscount + ' บาท'}</td>
          <td>${formatDate(fish.detail.expired)}${expired ? ' (หมดอายุ)' : ''}</td>
        </tr>`;
    });


    // คำนวณยอดสุทธิ = ราคารวม - ส่วนลด
    const net = total - discount;
    // เงินทอน = เงินที่ใส่มา - ยอดสุทธิ
    const change = inputValue - net;

    // แสดงผลลัพธ์ทั้งหมด
    $("#fish-list").html(rows);
    $("#total").text(total);
    $("#discount").text(discount);
    $("#net").text(net);
    $("#change").text(change < 0 ? 0 : change); // ถ้าขาดเงิน ให้แสดงเป็น 0

}
$("#calculate").on("click", calculate);