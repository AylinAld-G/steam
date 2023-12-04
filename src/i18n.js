import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // language resources
    resources: {
      es: {
        translation: {
         esp: "Español",
         nah: "Náhuatl",
         science: "Ciencia",
         tech: "Tecnología",
         eng: "Ingeniería",
         art: "Arte",
         math: "Matemáticas",
         login: "Iniciar sesión",
         logout: "Cerrar Sesión",
         search: "Buscar",
         dev: "Desarrollo",
         trad: "Contenido y traducción",
         message: "Mensaje",
         name: "Nombre",
         send: "Enviar",
         prev: "Anterior",
         contributors: "Colaboradores",
         mentor: "Mentoría",
         contact: "Contacto",
         contBtn: "Contactar",
         mssgTxt: "Mándanos un mensaje",
         mssgDesc: "Mándanos un mensaje y te responderemos en 24 horas",
         sentMssg: "Mensaje enviado",
         errorMssg: "Error al enviar el mensaje",
         userName: "Nombre de usuario",
         psswd: "Contraseña",
         signUp: "Crear una cuenta",
         register: "Registro",
         loginLnk: "¿Ya tienes una cuenta? Inicia sesión",
         createAcc: "Crear cuenta",
         articles: "Artículos",
         keepReading: "Continuar leyendo",
         comments: "Comentarios",
         //signUpBtn: "Crear una cuenta gratis"
        }
      },
      na: {
        translation: {
         esp: "Kaxtitl",
         nah: "Nauatl",
         science: "Tlamatilistli",
         tech: "Amantekayotl",
         eng: "Kuayolomachtilistli",
         art: "Toltekayotl",
         math: "Tlapoumatilistli",
         login: "Kalaki",
         logout: "Kisa",
         search: "Tlatemoa",
         dev: "Webchihualiz",
         trad: "Tlatolli ihuan Nahuatlajtolkuepalistli",
         message: "Amatlakuiloli",
         name: "Motocauh",
         send: "Titlani",
         prev: "Achtopan",
         contributors: "Palehuiani",
         mentor: "Tlamachtiliz",
         contact: "Namiquiliztli",
         contBtn: "Namiqui",
         mssgTxt: "Xitechhualtitlani ce Titetl",
         mssgDesc: "Xitechhualtitlani ce Titetl ihuan timitznanquilia ica cempohualli on nahui horas",
         sentMssg: "Amatlakuiloli titlanic",
         errorMssg: "Titlani ica tlatlacolli",
         userName: "Motocatl",
         psswd: "Occe iztiacatiliztica motocatl",
         signUp: "Xicchiua se tominicuiliuhtoc",
         register: "Icuiliuhtoc",
         loginLnk: "¿Ox tikpia se tominicuiliuhtoc? Xicpeua",
         createAcc: "Xicchiua tominicuiliuhtoc",
         articles: "Tlamantli",
         keepReading: "Nenepanoa amapohua",
         comments: "Itoa ce tlalnamiquilis",
         //signUpBtn: "Xicchiua se tominicuiliuhtoc ica amo ixtlahua"
        }
      },
    }
  });

export default i18n;