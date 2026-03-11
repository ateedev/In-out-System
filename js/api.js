const API_URL = "https://script.google.com/macros/s/AKfycbwAXI4wPpkT61DPd0nVEnu28qANfzVi-qsMCaOIiej37QdzbgwBaRNpGePxVscmJFw9/exec";

const API = {
    // ຟັງຊັນສຳລັບດຶງຂໍ້ມູນ (GET)
    async getDashboard() {
        const res = await fetch(API_URL);
        return await res.json();
    },
 
    // ຟັງຊັນສຳລັບສົ່ງຂໍ້ມູນ (POST) - ຕ້ອງຊື່ postData ເທົ່ານັ້ນ
    async postData(payload) {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await res.json(); 
    }
};