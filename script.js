document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("reportForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn = form.querySelector("button[type='submit']");

        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

        try {

            const fotoInput = document.getElementById("foto");

            let fotoBase64 = "";
            let namaFile = "";

            // ==========================
            // KONVERSI FOTO KE BASE64
            // ==========================

            if (fotoInput && fotoInput.files.length > 0) {

                const file = fotoInput.files[0];

                namaFile = file.name;

                fotoBase64 = await convertToBase64(file);

                console.log("Nama File:", namaFile);
                console.log("Ukuran Base64:", fotoBase64.length);

            }

            // ==========================
            // DATA YANG DIKIRIM
            // ==========================

            const data = {
                nama: document.getElementById("nama").value.trim(),
                lokasi: document.getElementById("lokasi").value.trim(),
                kategori: document.getElementById("kategori").value,
                prioritas: document.getElementById("prioritas").value,
                deskripsi: document.getElementById("deskripsi").value.trim(),
                namaFile: namaFile,
                foto: fotoBase64
            };

            console.log("DATA DIKIRIM:", data);

            // ==========================
            // KIRIM KE APPS SCRIPT
            // ==========================

            const response = await fetch(
                "https://script.google.com/macros/s/AKfycby_2G0WWjpiUT1ASRNJT8ECWf_-JqIfiNPS2816J4S84rkjFBANG0qtrnM144tbvdSU/exec",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(data)
                }
            );

            const text = await response.text();

            console.log("RESPON SERVER:", text);

            let result;

            try {

                result = JSON.parse(text);

            } catch {

                result = {
                    status: "success",
                    message: "Data berhasil dikirim"
                };

            }

            if (result.status === "success") {

                alert("✅ Laporan berhasil dikirim.");

                form.reset();

                const preview =
                    document.getElementById("previewImage");

                if (preview) {

                    preview.src = "";
                    preview.style.display = "none";

                }

            } else {

                alert("❌ " + result.message);

            }

        } catch (error) {

            console.error("ERROR:", error);

            alert(
                "❌ Gagal mengirim laporan.\n\n" +
                "Jika muncul CORS, gunakan hosting atau Apps Script HtmlService."
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                '<i class="fas fa-paper-plane"></i> Kirim Laporan';

        }

    });

});

// ===================================
// FUNGSI BASE64
// ===================================

function convertToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {

            const base64 =
                reader.result.split(",")[1];

            resolve(base64);

        };

        reader.onerror = error => {

            reject(error);

        };

    });

}

// ===================================
// PREVIEW FOTO
// ===================================

const fotoInput = document.getElementById("foto");

if (fotoInput) {

    fotoInput.addEventListener("change", function () {

        const file = this.files[0];

        const preview =
            document.getElementById("previewImage");

        if (!file || !preview) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;
            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}