import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define resources
const resources = {
  en: {
    translation: {
      "app": {
        "title": "KARTEJI",
        "welcome": "Welcome",
        "hello": "Hello"
      },
      "roles": {
        "Super Admin": "Super Admin",
        "Ketua": "Chairman",
        "Wakil Ketua": "Vice Chairman",
        "Bendahara": "Treasurer",
        "Sekretaris": "Secretary",
        "Anggota": "Member"
      },
      "members": {
        "title": "Members",
        "count": "People",
        "search": "Search members...",
        "all": "All",
        "edit": "Edit Member",
        "delete_confirm": "Are you sure you want to delete this member?",
        "no_data": "No members found.",
        "save": "Save Changes",
        "status": "Status",
        "role": "Role",
        "name": "Name",
        "drag_hint": "Drag to explore",
        "filter": {
          "Super Admin": "Super Admin",
          "Ketua": "Chairman",
          "Wakil Ketua": "Vice Chairman",
          "Bendahara": "Treasurer",
          "Sekretaris": "Secretary",
          "Anggota": "Member"
        }
      },
      "common": {
        "active": "Active",
        "inactive": "Inactive",
        "cancel": "Cancel",
        "language": "Language"
      }
    }
  },
  id: {
    translation: {
      "app": {
        "title": "KARTEJI",
        "welcome": "Selamat Datang",
        "hello": "Halo"
      },
      "roles": {
        "Super Admin": "Super Admin",
        "Ketua": "Ketua",
        "Wakil Ketua": "Wakil Ketua",
        "Bendahara": "Bendahara",
        "Sekretaris": "Sekretaris",
        "Anggota": "Anggota"
      },
      "members": {
        "title": "Anggota",
        "count": "Orang",
        "search": "Cari nama anggota...",
        "all": "Semua",
        "edit": "Edit Anggota",
        "delete_confirm": "Apakah Anda yakin ingin menghapus anggota ini?",
        "no_data": "Belum ada data anggota.",
        "save": "Simpan Perubahan",
        "status": "Status",
        "role": "Jabatan",
        "name": "Nama",
        "drag_hint": "Geser untuk melihat",
        "filter": {
          "Super Admin": "Super Admin",
          "Ketua": "Ketua",
          "Wakil Ketua": "Wakil Ketua",
          "Bendahara": "Bendahara",
          "Sekretaris": "Sekretaris",
          "Anggota": "Anggota"
        }
      },
      "common": {
        "active": "Aktif",
        "inactive": "Nonaktif",
        "cancel": "Batal",
        "language": "Bahasa"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "id", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
