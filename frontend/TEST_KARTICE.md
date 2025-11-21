# 💳 TEST BROJEVI KREDITNIH KARTICA

## ✅ VAŽEĆI BROJEVI ZA TESTIRANJE:

### 🔵 **Diners Club** (15 cifara)
- `300123456789012` - počinje sa 300
- `301234567890123` - počinje sa 301
- `302345678901234` - počinje sa 302
- `303456789012345` - počinje sa 303
- `361234567890123` - počinje sa 36
- `381234567890123` - počinje sa 38

### 🔴 **MasterCard** (16 cifara)
- `5112345678901234` - počinje sa 51
- `5223456789012345` - počinje sa 52
- `5334567890123456` - počinje sa 53
- `5445678901234567` - počinje sa 54
- `5556789012345678` - počinje sa 55

### 🟡 **Visa** (16 cifara)
- `4539123456789012` - počinje sa 4539
- `4556234567890123` - počinje sa 4556
- `4916345678901234` - počinje sa 4916
- `4532456789012345` - počinje sa 4532
- `4929567890123456` - počinje sa 4929
- `4485678901234567` - počinje sa 4485
- `4716789012345678` - počinje sa 4716

---

## ❌ NEVAŽEĆI BROJEVI (Za testiranje validacije):

- `1234567890123456` - ne počinje sa važećim prefiksom
- `4111111111111111` - Visa ali pogrešan prefiks (4111 nije dozvoljen)
- `5012345678901234` - MasterCard ali pogrešan prefiks (50 nije dozvoljen)
- `3001234567890` - Diners ali kratko (samo 13 cifara)
- `45391234567890123` - Visa ali dugo (17 cifara)

---

## 📋 PRAVILA VALIDACIJE:

### **Diners Club:**
- Počinje sa: `300`, `301`, `302`, `303`, `36`, `38`
- Dužina: **tačno 15 cifara**

### **MasterCard:**
- Počinje sa: `51`, `52`, `53`, `54`, `55`
- Dužina: **tačno 16 cifara**

### **Visa:**
- Počinje sa: `4539`, `4556`, `4916`, `4532`, `4929`, `4485`, `4716`
- Dužina: **tačno 16 cifara**

---

## 🧪 KAKO TESTIRATI:

1. **Idi na stranicu filma**
2. **Klikni "Iznajmi film"** (morate biti ulogovani)
3. **Izaberi datume** početka i kraja
4. **Unesi test broj kartice** iz liste gore
5. **Gledaj validaciju:**
   - Ako je kartica važeća → pojavljuje se **badge** sa tipom kartice (Visa/MasterCard/Diners)
   - Polje postaje **zeleno** ✅
   - Dugme "Potvrdi iznajmljivanje" postaje **aktivno**
6. **Probaj nevažeći broj** → polje postaje **crveno** ❌

---

## 💡 NAPOMENA:

Ovi brojevi su **fiktivni** i koriste se **samo za testiranje frontend validacije**. 
Nikada nemojte koristiti prave brojeve kreditnih kartica u development okruženju!
