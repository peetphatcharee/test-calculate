// const api = "https://sopon007.github.io/sample.github.io/test.json";
const fishes = [
  { name: "ปลาแซลม่อน", detail: { price: 50, quantity: 4, expired: "2025-08-30T00:00:00" } },
  { name: "ปลาช่อน", detail: { price: 10, quantity: 5, expired: "2025-08-23T00:00:00" } },
  { name: "ปลาทู", detail: { price: 5, quantity: 5, expired: "2025-08-24T00:00:00" } },
  { name: "ปลานิล", detail: { price: 20, quantity: 5, expired: "2025-08-20T00:00:00" } },
  { name: "ปลาหมอ", detail: { price: 1, quantity: 10, expired: "2025-08-21T00:00:00" } },
];
function calculate() {
  const inputValue = parseFloat(document.getElementById("inputValue").value);
  if (isNaN(inputValue) || inputValue > 1000)
    return alert("กรุณาใส่จำนวนเงินไม่เกิน 1000 บาท");
  getData(fishes, inputValue);
  //   fetch(api)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       getData(data, inputValue);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH");
}

function getData(data, inputValue) {
  // const table = document.getElementById("resultTable");
  // const empty = document.getElementById("emptyMessage");
  const resultBody = document.getElementById("resultBody");
  const resultTotal = document.getElementById("resultTotal");
  resultBody.innerHTML = "";
  resultTotal.innerHTML = "";

  // table.style.display = "block";
  // empty.style.display = "none";


  let remaining = inputValue;
  let totalBeforeDiscount = 0;
  let totalDiscount = 0;


  let salmonCount = 0;

  // กรองปลาที่ยังไม่หมดอายุและเรียงตามราคาจากมากไปน้อย
  const validFish = data
    .filter((f) => new Date(f.detail.expired) >= new Date())
    .sort((a, b) => b.detail.price - a.detail.price);

  const fishArray = [];

  validFish.forEach((fish) => {
    const price = fish.detail.price;
    const qtyAvailable = fish.detail.quantity;

    let qtyMax = Math.min(Math.floor(remaining / price), qtyAvailable); //หาว่าซื้อได้กี่ตัว
    let itemTotal = qtyMax * price; // คำนวณราคารวมของปลาตัวนั้น
    console.log(itemTotal, remaining);

    if (itemTotal <= remaining && qtyMax > 0) { // ถ้าราคาสุทธิไม่เกินเงินที่มีและจำนวนที่ซื้อได้มากกว่า 0
      remaining -= itemTotal;
      totalBeforeDiscount += itemTotal;

      // นับจำนวนแซลม่อนที่ซื้อ
      if (fish.name.includes("แซลม่อน")) {
        salmonCount += qtyMax;
      }

      const item = {
        name: fish.name,
        qty: qtyMax,
        price: price,
        total: itemTotal,
        discount: 0,
        expired: formatDate(fish.detail.expired),
      };
      fishArray.push(item);

      if (fish.name.includes("แซลม่อน") && salmonCount >= 2) {
        // กรณณีลดเป็นคู่
        // const discountUnit = 20;
        // const discountPair = Math.floor(salmonCount / 2); // 1 ส่วนลดต่อ 2 ตัว
        // const discount = discountUnit * discountPair;
        const discount = 20;
        item.discount = discount;
        totalDiscount += discount;
        remaining += discount; // เพิ่มเงินที่เหลือทันทีจากส่วนลด
      }
    }
  });



  // แสดงผลลัพธ์ในตาราง
  let rows = "";
  fishArray.forEach((item) => {
    rows += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty} ตัว</td>
        <td>${item.total} บาท</td>
        <td>${item.discount} บาท</td>
        <td>${item.expired}</td>
      </tr>
    `;
  });

  const net = totalBeforeDiscount - totalDiscount;
  const change = inputValue - net;

  resultBody.innerHTML = rows;
  resultTotal.innerHTML = `
    <p>รวมทั้งหมด (ก่อนลด): ${totalBeforeDiscount} บาท</p>
    <p>รวมได้ส่วนลด: ${totalDiscount} บาท</p>
    <p>ยอดสุทธิ (หลังหักส่วนลด): ${net} บาท</p>
    <p>เงินทอน: ${change < 0 ? 0 : change} บาท</p>
  `;
}