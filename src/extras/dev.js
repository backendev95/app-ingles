// ===== INGLÉS PARA DESARROLLADORES DE SOFTWARE =====
const DEV = {};

DEV.lessons = [
  { id: "dev-standup", icon: "☀️", title: "Daily stand-up", explain: `<p>En la daily cada persona responde tres cosas: qué hizo, qué hará y si tiene bloqueos. Se usa <b>pasado simple</b> o <b>presente perfecto</b> para lo hecho, <b>going to / will</b> para lo siguiente y frases fijas para los bloqueos.</p><p>Sé breve: 30–60 segundos. Los detalles se discuten después (<i>Let's take it offline</i>).</p>`,
    phrases: [["Yesterday I worked on the login page.", "Ayer trabajé en la página de inicio de sesión."], ["I finished the API integration.", "Terminé la integración con la API."], ["Today I'm going to write the unit tests.", "Hoy voy a escribir las pruebas unitarias."], ["I'm blocked by the database migration.", "Estoy bloqueado por la migración de la base de datos."], ["I'm waiting on feedback from the design team.", "Estoy esperando retroalimentación del equipo de diseño."], ["It's taking longer than expected because of some edge cases.", "Está tomando más de lo esperado por algunos casos borde."], ["I should have it ready by tomorrow.", "Debería tenerlo listo para mañana."], ["No blockers on my side.", "Sin bloqueos de mi parte."], ["Can we take this offline?", "¿Lo hablamos aparte después?"], ["I'll sync with Ana after the meeting.", "Me pongo de acuerdo con Ana después de la reunión."]],
    ex: [
      ["mc", "Yesterday I ___ the bug in the payment module.", ["fix", "fixed", "have fix"], 1, "Ayer = pasado simple."],
      ["mc", "I'm blocked ___ the pending code review.", ["by", "of", "for"], 0, "Blocked by = bloqueado por."],
      ["fill", "I'm waiting ___ the QA team to test it.", ["for", "on"], "Wait for / wait on."],
      ["mc", "La frase más natural para decir que no tienes bloqueos:", ["I don't have blocks.", "No blockers on my side.", "There isn't blocking."], 1, "Expresión fija de las dailies."],
      ["tr", "Hoy voy a revisar el pull request de Juan.", ["Today I'm going to review Juan's pull request.", "Today I am going to review Juan's pull request.", "Today I'll review Juan's pull request.", "Today I will review Juan's pull request.", "Today I'm going to review Juan's PR.", "Today I'll review Juan's PR."], "Going to / will + verbo."],
      ["fix", "I am working in the new feature since Monday.", ["I've been working on the new feature since Monday.", "I have been working on the new feature since Monday."], "Since → presente perfecto continuo; work ON a feature."],
      ["ord", "Debería tenerlo listo para el viernes.", "I should have it ready by Friday"],
      ["mc", "'Let's take it offline' significa:", ["Apagar internet", "Hablarlo después, fuera de la reunión", "Cancelar la tarea"], 1, "Se usa para no alargar la daily."]
    ]},
  { id: "dev-bugs", icon: "🐞", title: "Reportar y explicar un bug", explain: `<p>Un buen reporte tiene: <b>steps to reproduce</b> (pasos), <b>expected behavior</b> (lo esperado) y <b>actual behavior</b> (lo que pasa). Al investigar se usan verbos como <i>reproduce, narrow down, track down, roll back</i>.</p><p>Para especular sobre la causa usa modales: <i>It might be a caching issue. It must be related to the last deploy.</i></p>`,
    phrases: [["The app crashes when I click the save button.", "La app se cae cuando hago clic en guardar."], ["Here are the steps to reproduce it.", "Estos son los pasos para reproducirlo."], ["The expected behavior is that the user gets an email.", "El comportamiento esperado es que el usuario reciba un correo."], ["I can't reproduce it on my machine.", "No lo puedo reproducir en mi máquina."], ["It only happens in production.", "Solo pasa en producción."], ["It might be a caching issue.", "Podría ser un problema de caché."], ["I've narrowed it down to the authentication service.", "Lo acoté al servicio de autenticación."], ["The root cause was a missing null check.", "La causa raíz fue una validación de nulos faltante."], ["As a workaround, you can refresh the page.", "Como solución temporal, puedes recargar la página."], ["I pushed a hotfix and it's working now.", "Subí un hotfix y ya funciona."]],
    ex: [
      ["mc", "'Steps to reproduce' es:", ["Pasos para reproducir el error", "Pasos para desplegar", "Pasos de instalación"], 0, "Sección clave de un bug report."],
      ["mc", "The error only ___ when the user is logged out.", ["happens", "is happening ever", "happen"], 0, "Presente simple + 3.ª persona."],
      ["fill", "It ___ be a timezone issue, but I'm not sure. (podría)", ["might", "may", "could"], "Posibilidad: might/may/could."],
      ["mc", "The root cause ___ an expired certificate.", ["were", "was", "has"], 1, "Pasado, singular."],
      ["tr", "No puedo reproducir el error.", ["I can't reproduce the error.", "I cannot reproduce the error.", "I can't reproduce the bug.", "I cannot reproduce the bug.", "I can't reproduce the issue."], "Reproduce = reproducir un fallo."],
      ["fix", "The app is crashing since the last deploy.", ["The app has been crashing since the last deploy."], "Since → presente perfecto continuo."],
      ["mc", "'Workaround' significa:", ["Solución temporal que evita el problema", "Trabajo extra", "Ronda de pruebas"], 0, "No arregla la causa, la esquiva."],
      ["ord", "Lo acoté al servicio de pagos.", "I narrowed it down to the payment service"]
    ]},
  { id: "dev-review", icon: "🔍", title: "Code review", explain: `<p>En un code review se critica el código, no a la persona. Los comentarios suelen ser <b>sugerencias suaves</b>: <i>What do you think about...? Have you considered...? I'd suggest...</i></p><p>Abreviaturas comunes: <b>LGTM</b> (looks good to me), <b>nit</b> (detalle menor, no bloquea), <b>PTAL</b> (please take a look), <b>WIP</b> (work in progress).</p>`,
    phrases: [["Nit: this variable name could be more descriptive.", "Detalle menor: este nombre de variable podría ser más descriptivo."], ["Could you add a unit test for this case?", "¿Podrías agregar una prueba unitaria para este caso?"], ["What do you think about extracting this into a separate function?", "¿Qué opinas de extraer esto a una función aparte?"], ["Have you considered using a map instead of a list?", "¿Consideraste usar un mapa en lugar de una lista?"], ["This might cause a race condition.", "Esto podría causar una condición de carrera."], ["Good catch! I'll fix it.", "¡Buena observación! Lo arreglo."], ["Let's address this in a follow-up PR.", "Atendamos esto en un PR posterior."], ["I'm not sure I follow. Could you explain the reasoning?", "No estoy seguro de entender. ¿Podrías explicar el razonamiento?"], ["Addressed in the latest commit.", "Resuelto en el último commit."], ["LGTM, approving now.", "Se ve bien, lo apruebo ya."]],
    ex: [
      ["mc", "'LGTM' significa:", ["Let's go to meeting", "Looks good to me", "Last good test merged"], 1, "Aprobación informal."],
      ["mc", "La forma más diplomática de sugerir un cambio:", ["This is wrong. Change it.", "What do you think about renaming this?", "Bad name."], 1, "Sugerencia en forma de pregunta."],
      ["mc", "'Nit:' al inicio de un comentario indica:", ["Un error grave", "Un detalle menor que no bloquea", "Una pregunta"], 1, "Nitpick."],
      ["fill", "Have you ___ (consider) adding a cache here?", ["considered"], "Have you considered + -ing."],
      ["tr", "¡Buena observación! Lo arreglo en el próximo commit.", ["Good catch! I'll fix it in the next commit.", "Good catch! I will fix it in the next commit."], "Good catch = buena observación."],
      ["fix", "Could you adding a test for this?", ["Could you add a test for this?"], "Could + verbo base."],
      ["ord", "Atendamos esto en un PR posterior.", "Let's address this in a follow-up PR"],
      ["mc", "'PTAL' se usa para:", ["Pedir que alguien revise", "Cerrar un ticket", "Avisar un despliegue"], 0, "Please take a look."]
    ]},
  { id: "dev-clarify", icon: "🙋", title: "Pedir aclaraciones y ayuda", explain: `<p>Preguntar bien es una habilidad clave en equipos remotos. Usa preguntas indirectas y corteses: <i>Could you walk me through...? Just to make sure I understand...</i></p><p>Recuerda: en preguntas indirectas no se invierte el orden: <i>Do you know <b>where the logs are</b>?</i> (no <i>where are the logs</i>).</p>`,
    phrases: [["Just to make sure I understand, you want the export in CSV, right?", "Para asegurarme de entender, quieres la exportación en CSV, ¿cierto?"], ["Could you walk me through the deployment process?", "¿Me podrías explicar paso a paso el proceso de despliegue?"], ["What's the expected behavior when the list is empty?", "¿Cuál es el comportamiento esperado cuando la lista está vacía?"], ["Do you have a minute to pair on this?", "¿Tienes un minuto para trabajar esto en pareja?"], ["Is there any documentation on this service?", "¿Hay documentación de este servicio?"], ["Who's the owner of this repository?", "¿Quién es el responsable de este repositorio?"], ["Sorry, could you repeat the last part?", "Perdón, ¿podrías repetir la última parte?"], ["Do you know where the logs are stored?", "¿Sabes dónde se guardan los logs?"], ["I've been stuck on this for a while. Any ideas?", "Llevo un rato atascado con esto. ¿Alguna idea?"], ["Thanks, that makes sense now.", "Gracias, ahora tiene sentido."]],
    ex: [
      ["mc", "Do you know where ___?", ["are the logs", "the logs are", "is the logs"], 1, "Pregunta indirecta: orden normal."],
      ["fix", "Can you explain me how this works?", ["Can you explain to me how this works?", "Can you explain how this works?"], "Explain something TO someone."],
      ["mc", "'Could you walk me through it?' significa:", ["¿Me acompañas a caminar?", "¿Me lo explicas paso a paso?", "¿Lo revisas tú solo?"], 1, "Walk through = explicar paso a paso."],
      ["fill", "I've been ___ on this for two hours. (atascado)", ["stuck"], "Be stuck = estar atascado."],
      ["tr", "¿Tienes un minuto para revisar esto conmigo?", ["Do you have a minute to look at this with me?", "Do you have a minute to review this with me?", "Have you got a minute to look at this with me?", "Do you have a minute to go over this with me?"], "Do you have a minute to...?"],
      ["ord", "Para asegurarme de que entiendo, ¿es solo para administradores?", "Just to make sure I understand is it only for admins"],
      ["mc", "Who is the ___ of this microservice? (responsable)", ["owner", "boss", "master"], 0, "Owner = responsable de un componente."]
    ]},
  { id: "dev-estimate", icon: "📅", title: "Estimar, planificar y decir que no", explain: `<p>En planning se habla de <b>story points, scope, priorities, deadlines</b>. Decir que no con profesionalismo es esencial: explica el motivo y ofrece alternativas.</p><p><i>I don't think we can commit to that by Friday, but we could ship a first version without the reports.</i></p>`,
    phrases: [["I'd estimate it at about five story points.", "Lo estimaría en unos cinco puntos de historia."], ["It depends on how complex the integration is.", "Depende de qué tan compleja sea la integración."], ["There are still some unknowns.", "Todavía hay algunas incógnitas."], ["Let's break it down into smaller tasks.", "Dividámoslo en tareas más pequeñas."], ["That's out of scope for this sprint.", "Eso está fuera del alcance de este sprint."], ["I don't think we can commit to that deadline.", "No creo que podamos comprometernos con esa fecha."], ["We could ship an MVP first and iterate.", "Podríamos lanzar primero un MVP e iterar."], ["What's the priority: speed or quality?", "¿Cuál es la prioridad: velocidad o calidad?"], ["The deadline is tight, but doable if we cut the reports.", "La fecha es ajustada, pero viable si quitamos los reportes."], ["I'll give you a more accurate estimate tomorrow.", "Mañana te doy un estimado más preciso."]],
    ex: [
      ["mc", "That feature is out of ___ for this sprint.", ["scope", "range", "reach"], 0, "Out of scope = fuera del alcance."],
      ["mc", "Forma profesional de decir que no:", ["No. Impossible.", "I don't think we can commit to that, but we could deliver part of it.", "I won't do it."], 1, "Motivo + alternativa."],
      ["fill", "Let's ___ it down into smaller tasks.", ["break"], "Break down = dividir."],
      ["mc", "If we ___ the reports, we can finish on time.", ["will cut", "cut", "cutting"], 1, "Primer condicional: if + presente."],
      ["tr", "Depende de la complejidad.", ["It depends on the complexity.", "It depends on how complex it is."], "Depend ON."],
      ["fix", "It depends of the API.", ["It depends on the API."], "Depend on, no of."],
      ["ord", "Podríamos lanzar primero un MVP.", "We could ship an MVP first"]
    ]},
  { id: "dev-written", icon: "✍️", title: "Commits, PRs, tickets y Slack", explain: `<p><b>Commits</b>: en imperativo y cortos: <i>Fix login redirect</i>, <i>Add pagination to users endpoint</i> (no <i>Fixed</i> ni <i>Fixing</i>).</p><p><b>Slack/email</b>: <b>FYI</b> (para tu información), <b>heads-up</b> (aviso), <b>ETA</b> (hora estimada), <b>EOD</b> (fin del día), <b>ASAP</b>, <b>TL;DR</b> (resumen), <b>OOO</b> (fuera de la oficina).</p>`,
    phrases: [["Fix null pointer exception in checkout", "Corrige excepción de puntero nulo en el checkout (commit)"], ["Add pagination to the users endpoint", "Agrega paginación al endpoint de usuarios (commit)"], ["Heads-up: the staging server will be down for maintenance.", "Aviso: el servidor de staging estará caído por mantenimiento."], ["FYI, the client approved the new design.", "Para tu información, el cliente aprobó el nuevo diseño."], ["What's the ETA for the fix?", "¿Para cuándo se estima el arreglo?"], ["I'll have it done by EOD.", "Lo tendré listo al final del día."], ["TL;DR: we need to upgrade the library.", "Resumen: hay que actualizar la librería."], ["I'll be OOO on Friday.", "Estaré fuera de la oficina el viernes."], ["Thanks in advance!", "¡Gracias de antemano!"], ["Sorry for the delay in getting back to you.", "Perdón por la demora en responderte."]],
    ex: [
      ["mc", "El mejor mensaje de commit:", ["Fixed some stuff", "Fix login redirect after password reset", "fixing bugs"], 1, "Imperativo y descriptivo."],
      ["mc", "'ETA' significa:", ["Tiempo estimado de llegada/entrega", "Error en la aplicación", "Equipo técnico asignado"], 0, "Estimated time of arrival."],
      ["mc", "'EOD' significa:", ["End of day", "Error on deploy", "Every other day"], 0, "Fin del día laboral."],
      ["fill", "___-up: the API will change next week. (aviso)", ["heads"], "Heads-up = aviso anticipado."],
      ["fix", "Added a new endpoint for reports", ["Add a new endpoint for reports", "Add new endpoint for reports"], "Commits en imperativo."],
      ["tr", "Estaré fuera de la oficina mañana.", ["I'll be out of the office tomorrow.", "I will be out of the office tomorrow.", "I'll be OOO tomorrow."], "OOO = out of office."],
      ["mc", "'TL;DR' se usa para:", ["Dar un resumen corto", "Pedir ayuda", "Cerrar un PR"], 0, "Too long; didn't read."]
    ]},
  { id: "dev-demo", icon: "🖥️", title: "Reuniones, demos y presentaciones", explain: `<p>En reuniones remotas hay frases que se repiten siempre: compartir pantalla, problemas de conexión, turnos de palabra. En una demo, guía a la audiencia con conectores: <i>First..., Next..., As you can see..., To sum up...</i></p>`,
    phrases: [["Let me share my screen.", "Déjame compartir mi pantalla."], ["Can everyone see my screen?", "¿Todos pueden ver mi pantalla?"], ["You're on mute.", "Estás silenciado."], ["Sorry, you broke up a little. Could you repeat that?", "Perdón, se te cortó un poco. ¿Lo repites?"], ["Let me walk you through the new feature.", "Déjenme mostrarles paso a paso la nueva funcionalidad."], ["As you can see here, the dashboard loads much faster.", "Como pueden ver aquí, el tablero carga mucho más rápido."], ["Bear with me for a second.", "Denme un segundo, por favor."], ["Any questions so far?", "¿Alguna pregunta hasta aquí?"], ["To sum up, we reduced the load time by forty percent.", "En resumen, redujimos el tiempo de carga un cuarenta por ciento."], ["I'll follow up with an email.", "Les haré seguimiento por correo."]],
    ex: [
      ["mc", "Alguien habla pero no se le oye. Dices:", ["You're on mute.", "You're silent mode.", "You are muted off."], 0, "Expresión estándar."],
      ["mc", "'Bear with me' significa:", ["Ten paciencia un momento", "Ven conmigo", "Soporta el error"], 0, "Pedir un momento de paciencia."],
      ["fill", "Let me ___ my screen.", ["share"], "Share your screen."],
      ["mc", "To ___ up, the release went smoothly.", ["sum", "some", "add"], 0, "To sum up = en resumen."],
      ["tr", "¿Alguna pregunta hasta ahora?", ["Any questions so far?", "Are there any questions so far?", "Do you have any questions so far?"], "So far = hasta ahora."],
      ["ord", "Les haré seguimiento por correo.", "I will follow up with an email"]
    ]},
  { id: "dev-grammar", icon: "🧩", title: "Gramática que más usarás en TI", explain: `<p><b>Presente perfecto</b> para estados actuales: <i>I've deployed the fix. Have you merged the branch?</i></p><p><b>Pasiva</b> en documentación: <i>The token is stored in a cookie. The data was migrated last night.</i></p><p><b>Condicionales</b> para lógica y reglas: <i>If the request fails, the client retries three times.</i></p><p><b>Modales</b> para expectativas: <i>It should work now. It shouldn't take long.</i></p>`,
    phrases: [["I've already deployed the fix to staging.", "Ya desplegué el arreglo en staging."], ["Have you merged the feature branch yet?", "¿Ya hiciste merge de la rama?"], ["The token is stored in a secure cookie.", "El token se guarda en una cookie segura."], ["The data was migrated last night.", "Los datos se migraron anoche."], ["If the request fails, the client retries three times.", "Si la petición falla, el cliente reintenta tres veces."], ["It should work now. Could you try again?", "Ya debería funcionar. ¿Puedes intentar de nuevo?"], ["The tests are being run in the pipeline.", "Las pruebas se están ejecutando en el pipeline."], ["This method has been deprecated.", "Este método fue marcado como obsoleto."]],
    ex: [
      ["mc", "___ you merged the branch yet?", ["Did", "Have", "Are"], 1, "Yet → presente perfecto."],
      ["mc", "The passwords ___ hashed before they ___ saved.", ["are / are", "is / is", "were / was"], 0, "Pasiva presente, plural."],
      ["fill", "If the cache ___ (be) empty, the service calls the database.", ["is"], "Condicional cero: if + presente."],
      ["mc", "I restarted the server. It ___ work now.", ["should", "must to", "would to"], 0, "Expectativa: should."],
      ["fix", "This function was deprecate in version 2.", ["This function was deprecated in version 2."], "Pasiva: was + participio."],
      ["tr", "Ya hice el despliegue a producción.", ["I've already deployed to production.", "I have already deployed to production.", "I've already deployed it to production.", "I already deployed to production."], "Already + presente perfecto."],
      ["ord", "Los datos se migraron anoche.", "The data was migrated last night"]
    ]}
];

DEV.vocab = `# Código y desarrollo
codebase|código base|The codebase is huge and poorly documented.
feature|funcionalidad|We shipped a new feature today.
requirement|requisito|What are the requirements for this task?
deadline|fecha límite|The deadline is next Friday.
release|lanzamiento / versión|The next release is on Monday.
ship|lanzar / entregar|We need to ship this before the demo.
refactor|refactorizar|I refactored the payment module.
deprecated|obsoleto (marcado)|This endpoint is deprecated.
legacy code|código heredado / antiguo|We still maintain a lot of legacy code.
technical debt|deuda técnica|We need to pay down technical debt.
maintainable|mantenible|Write clean and maintainable code.
readable|legible|This function isn't very readable.
dependency|dependencia|Update the dependencies regularly.
library|librería|Which library do you use for dates?
framework|framework / marco de trabajo|We use a React framework.
environment|entorno|It works in the test environment.
# Git y control de versiones
repository|repositorio|Clone the repository first.
branch|rama|Create a new branch for the feature.
merge|fusionar|I merged the branch into main.
merge conflict|conflicto de fusión|I had to resolve a merge conflict.
pull request|solicitud de cambios (PR)|I opened a pull request.
commit|confirmar cambios / commit|Commit your changes often.
push|subir cambios|Don't push directly to main.
pull|traer cambios|Pull the latest changes first.
rebase|rebasar|Rebase your branch on main.
revert|revertir|We reverted the last commit.
approve|aprobar|Two people must approve the PR.
# Agile y gestión
sprint|sprint|The sprint lasts two weeks.
backlog|lista de pendientes|Add it to the backlog.
user story|historia de usuario|Write the user story first.
acceptance criteria|criterios de aceptación|Check the acceptance criteria.
story points|puntos de historia|How many story points is it?
stakeholder|interesado / parte interesada|The stakeholders want a demo.
scope|alcance|That's out of scope.
priority|prioridad|What's the top priority?
retrospective|retrospectiva|We discussed it in the retrospective.
blocker|bloqueo / impedimento|Do you have any blockers?
estimate|estimar / estimación|Can you estimate this task?
# Bugs, pruebas y calidad
bug|error / fallo|I found a bug in the login.
issue|problema / incidencia|Open an issue on GitHub.
crash|caerse / fallar|The app crashes on startup.
reproduce|reproducir (un error)|I can't reproduce the bug.
root cause|causa raíz|We found the root cause.
workaround|solución temporal|Is there a workaround?
hotfix|arreglo urgente|We deployed a hotfix.
edge case|caso borde|Don't forget the edge cases.
unit test|prueba unitaria|Add unit tests for this function.
regression|regresión|The update caused a regression.
flaky test|prueba inestable|That flaky test fails randomly.
coverage|cobertura|Our test coverage is 80%.
debug|depurar|I spent hours debugging this.
log|registro / log|Check the logs for errors.
# DevOps y nube
deploy|desplegar|We deploy twice a week.
deployment|despliegue|The deployment failed.
pipeline|pipeline / flujo automatizado|The CI pipeline is green.
build|compilación / compilar|The build is broken.
staging|entorno de pruebas previo a producción|Test it on staging first.
production|producción|Never test in production.
downtime|tiempo de inactividad|We had ten minutes of downtime.
outage|caída del servicio|There was a major outage last night.
scalable|escalable|The system must be scalable.
latency|latencia|We reduced the latency.
load balancer|balanceador de carga|Add another load balancer.
container|contenedor|Run the app in a container.
monitoring|monitoreo|We need better monitoring.
alert|alerta|I got an alert at 3 a.m.
on call|de guardia|I'm on call this week.
# Arquitectura y datos
endpoint|endpoint / punto de acceso|Call the users endpoint.
request|petición|The request timed out.
response|respuesta|The response is in JSON.
payload|carga útil / contenido|Send the data in the payload.
database|base de datos|The database is slow.
query|consulta|Optimise this query.
schema|esquema|We changed the database schema.
cache|caché|Clear the cache and try again.
authentication|autenticación|We use OAuth for authentication.
authorization|autorización|Authorization controls what users can do.
microservice|microservicio|Each microservice has its own database.
trade-off|compromiso / ventaja y desventaja|Every design has trade-offs.
bottleneck|cuello de botella|The database is the bottleneck.
# Phrasal verbs técnicos
roll out|desplegar gradualmente|We'll roll out the feature next week.
roll back|revertir (un despliegue)|We had to roll back the release.
spin up|levantar (un servidor)|Spin up a new instance.
set up|configurar|I set up the development environment.
look into|investigar|I'll look into the issue.
figure out|averiguar / resolver|I can't figure out what's wrong.
run into|toparse con|We ran into a performance problem.
break down|dividir / desglosar|Break the task down.
wrap up|terminar / cerrar|Let's wrap up the meeting.
sign off|dar el visto bueno|The client signed off on the design.
hand over|entregar / traspasar|I'll hand over the project to Ana.
go live|salir a producción|The site goes live tomorrow.
catch up|ponerse al día|Let's catch up after lunch.
reach out|contactar|Feel free to reach out if you need help.
follow up|hacer seguimiento|I'll follow up on that.
# Carrera y trabajo
remote|remoto|It's a fully remote position.
hiring process|proceso de selección|The hiring process has four steps.
take-home assignment|prueba técnica para casa|They sent me a take-home assignment.
salary range|rango salarial|What's the salary range?
benefits|beneficios|The benefits include health insurance.
seniority|nivel de experiencia|What seniority are they looking for?
skill set|conjunto de habilidades|My skill set includes React and Node.
background|trayectoria / formación|I have a background in backend development.
ownership|apropiación / responsabilidad|She takes ownership of her work.
mentor|mentor / mentorear|I mentor two junior developers.
onboarding|incorporación|The onboarding took two weeks.
performance review|evaluación de desempeño|My performance review is next month.`;

DEV.pron = [
  ["cache", "cache", "Suena como «cash», no «cachei» ni «cachet»."],
  ["GUI", "gooey", "Se dice «gúi» (como gooey)."],
  ["SQL", "sequel", "«Sícuel» o letra por letra «es-kiu-el». Ambas valen."],
  ["Linux", "Linux", "«LÍ-nux», con i corta, no «Lainux»."],
  ["Azure", "Azure", "«Á-zher», no «azure» a la española."],
  ["nginx", "engine x", "Se dice «engine-ex»."],
  ["Kubernetes", "Kubernetes", "«ku-ber-NÉ-tis», acento en la tercera sílaba."],
  ["query", "query", "«KUÍ-ri»."],
  ["integer", "integer", "«ÍN-ti-yer», la g suena como «y» fuerte."],
  ["boolean", "boolean", "«BÚ-li-an»."],
  ["char", "char", "«char» (como charcoal) o «car». Ambas se oyen."],
  ["data", "data", "«DÉI-ta» (EE. UU.) o «DÁ-ta». No «data» con a abierta española."],
  ["API", "A P I", "Letra por letra: «ei-pi-ai»."],
  ["JSON", "Jason", "Como el nombre Jason: «YÉI-son»."],
  ["YAML", "YAML", "«YÁ-mel»."],
  ["deploy", "deploy", "«di-PLÓI», acento al final."],
  ["null", "null", "«nal» (rima con «dull»)."],
  ["async", "async", "«ÉI-sink»."],
  ["regex", "regex", "«RÉ-yex»."],
  ["width", "width", "«widz» con th suave al final."],
  ["height", "height", "«jait», termina en t, no en th."],
  ["Python", "Python", "«PÁI-zon»."],
  ["variable", "variable", "«VÉ-ri-a-bel», acento en la primera."],
  ["suite", "suite", "Como «sweet»: test suite = «test suít»."],
  ["router", "router", "«RÁU-ter» en EE. UU."],
  ["Git", "git", "Con g dura: «guit»."],
  ["Docker", "Docker", "«DÓ-ker»."],
  ["Vue", "view", "Se dice igual que «view»."],
  ["Nuxt", "next", "Suena casi igual que «next»."],
  ["Hibernate", "hibernate", "«JÁI-ber-neit»."]
];

DEV.interview = [
  { q: "Tell me about yourself.", tip: "1–2 minutos: quién eres profesionalmente → experiencia relevante → un logro → por qué te interesa este puesto. No cuentes tu vida personal.", model: "I'm a full-stack developer with five years of experience, mainly working with React and Node.js. In my current role at a fintech company, I lead the development of our customer dashboard, which is used by over fifty thousand users. Recently, I led a migration to microservices that reduced our deployment time by sixty percent. I'm now looking for a remote role where I can work on larger-scale systems and keep growing as a technical leader." },
  { q: "Why do you want to work here?", tip: "Menciona algo concreto de la empresa (producto, tecnología, cultura) y conéctalo con tus metas.", model: "I've been following your product for a while, and I really like how you focus on developer experience. Your stack is very close to what I use every day, and I'm especially interested in the work you're doing with real-time data. I think I could contribute from day one and also learn a lot from your team." },
  { q: "Tell me about a challenging bug you solved.", tip: "Usa el método STAR: Situación, Tarea, Acción, Resultado. Habla en pasado y en primera persona.", model: "Last year, our checkout service started failing randomly in production. My task was to find the root cause quickly because we were losing sales. I added more detailed logging, reproduced the issue with a load test, and narrowed it down to a race condition in our payment queue. I implemented a lock and added tests for that case. As a result, the errors dropped to zero and we haven't had the problem since." },
  { q: "Tell me about a time you disagreed with a teammate.", tip: "Muestra que escuchas, argumentas con datos y priorizas al equipo. Termina con un resultado positivo.", model: "In one project, a teammate wanted to rewrite a module from scratch, while I thought we should refactor it gradually. Instead of arguing, we listed the risks and estimated both options together. We agreed on a gradual refactor with clear milestones. In the end, we delivered on time, and he later told me he appreciated how we handled it." },
  { q: "What is your greatest weakness?", tip: "Elige una debilidad real pero no crítica, y explica qué estás haciendo para mejorarla.", model: "I used to have trouble delegating tasks because I wanted everything to be perfect. As I started leading small teams, I realised this was slowing us down. Now I set clear expectations, review work through pull requests, and trust my teammates more. It's still something I'm working on, but I've improved a lot." },
  { q: "How do you handle tight deadlines?", tip: "Habla de priorizar, comunicar temprano y negociar el alcance.", model: "First, I break the work down and identify what's essential for the deadline. If I see a risk, I communicate it early rather than at the last minute. Sometimes that means proposing to ship a smaller first version and adding the rest later. I've found that being transparent builds trust with stakeholders." },
  { q: "Describe a project you're proud of.", tip: "Elige un proyecto con impacto medible. Explica tu rol específico, no solo lo que hizo el equipo.", model: "I'm very proud of an internal tool I built to automate our release notes. Before, it took the team about four hours every sprint. I wrote a script that reads merged pull requests and generates a draft automatically. It now takes ten minutes, and other teams in the company have adopted it too." },
  { q: "How do you keep your skills up to date?", tip: "Menciona hábitos concretos: cursos, documentación, proyectos personales, comunidades.", model: "I read the official documentation and changelogs of the tools I use, and I take one online course every few months. I also build small side projects to try new technologies, like a recent one with serverless functions. And I'm learning English intensively, because most of the best resources are in English." },
  { q: "Explain a technical concept to a non-technical person.", tip: "Usa una analogía sencilla y evita jerga. Aquí, por ejemplo, explicar una API.", model: "An API is like a waiter in a restaurant. You don't go into the kitchen yourself; you tell the waiter what you want, the waiter takes your order to the kitchen, and then brings your food back. In the same way, an application sends a request to an API, and the API returns the information it needs." },
  { q: "What's the difference between SQL and NoSQL databases?", tip: "Responde con estructura: definición, diferencia principal, cuándo usar cada una.", model: "SQL databases store data in tables with a fixed schema and are great when you need strong consistency and complex relationships, like in financial systems. NoSQL databases are more flexible: they can store documents, key-value pairs or graphs, and they usually scale horizontally more easily. I'd choose one or the other depending on the data model and the consistency requirements." },
  { q: "How would you design a URL shortener?", tip: "En diseño de sistemas, piensa en voz alta: aclara requisitos, propone una solución simple y luego habla de escala y trade-offs.", model: "First, I'd clarify the requirements: how many URLs per day, whether links expire, and if we need analytics. Then I'd start simple: an API that generates a short unique code, stores the mapping in a database, and redirects users. To scale, I'd add a cache for popular links and use a key-value store. One trade-off is between short codes and the risk of collisions." },
  { q: "Where do you see yourself in five years?", tip: "Muestra ambición alineada con el puesto: crecer técnicamente o hacia liderazgo.", model: "In five years, I'd like to be a senior or staff engineer, making architecture decisions and mentoring other developers. I enjoy both the technical side and helping people grow, so I see myself in a role that combines the two." },
  { q: "What are your salary expectations?", tip: "Investiga el rango antes. Da un rango, no un número exacto, y muestra flexibilidad.", model: "Based on my experience and the market for remote roles like this one, I'm looking for something in the range of four to five thousand dollars a month. That said, I'm open to discussing it, depending on the full package and the growth opportunities." },
  { q: "Do you have any questions for us?", tip: "Siempre di que sí. Pregunta por el equipo, el proceso de trabajo o los retos técnicos.", model: "Yes, thank you. What does a typical day look like for someone in this role? And what are the biggest technical challenges the team is facing right now?" },
  { q: "How do you approach code reviews?", tip: "Habla de respeto, objetividad y aprendizaje mutuo.", model: "I see code reviews as a learning opportunity for both sides. When I review, I focus on correctness, readability and tests, and I try to phrase comments as suggestions or questions. When my code is reviewed, I don't take it personally; I ask for clarification if I don't agree and I'm happy to change my mind." }
];

DEV.roleplays = [
  { title: "Tu daily stand-up", intro: "Es la daily del equipo y el Scrum Master te da la palabra.", turns: [
    ["Good morning! Let's start. What did you work on yesterday?", "Di que terminaste la página de registro y empezaste las pruebas.", ["Yesterday I finished the sign-up page and started writing the tests.", "I finished the registration page yesterday and started working on the tests.", "Yesterday I completed the sign-up page and began the unit tests."]],
    ["Great. And what's the plan for today?", "Di que hoy vas a terminar las pruebas y abrir el pull request.", ["Today I'm going to finish the tests and open a pull request.", "Today I'll finish the tests and open the pull request.", "My plan is to finish the tests today and open a PR."]],
    ["Any blockers?", "Di que estás esperando las credenciales de la API de pagos.", ["Yes, I'm waiting on the credentials for the payment API.", "I'm blocked because I'm still waiting for the payment API credentials.", "Just one: I'm waiting for the credentials for the payments API."]],
    ["I'll check with the client. Do you think you'll finish this sprint?", "Di que debería estar listo el jueves si recibes las credenciales hoy.", ["It should be ready by Thursday if I get the credentials today.", "If I get the credentials today, I should have it ready by Thursday.", "I should be able to finish it by Thursday, as long as I get the credentials today."]],
    ["Perfect, thanks!", "Propón hablar con el equipo de backend después de la reunión.", ["Thanks. I'll sync with the backend team after the meeting.", "Thank you. Can we take the API details offline with the backend team?", "Thanks! I'll catch up with the backend team after the stand-up."]]
  ]},
  { title: "Explicar un bug a tu líder", intro: "Tu tech lead te pregunta por un error reportado en producción.", turns: [
    ["Hey, I heard there's a problem with the checkout. What's going on?", "Explica que algunos usuarios no pueden pagar con tarjeta desde ayer.", ["Some users haven't been able to pay by card since yesterday.", "Since yesterday, some users can't pay by card.", "A few users have been unable to pay by card since yesterday."]],
    ["Do we know what's causing it?", "Di que lo acotaste al servicio de pagos y que podría ser un problema de tiempo de espera.", ["I've narrowed it down to the payment service. It might be a timeout issue.", "I narrowed it down to the payment service; it could be a timeout problem.", "It seems to be in the payment service. My guess is a timeout issue."]],
    ["How many users are affected?", "Di que alrededor del cinco por ciento, sobre todo en móvil.", ["Around five percent, mostly on mobile.", "About five percent of users, mainly on mobile devices.", "Roughly five percent, mostly mobile users."]],
    ["Is there a workaround?", "Di que sí: pueden pagar con PSE mientras lo arreglas.", ["Yes, they can pay with PSE while I fix it.", "Yes, as a workaround they can use PSE until the fix is ready.", "For now, users can pay with PSE as a workaround."]],
    ["OK. When do you expect to have a fix?", "Di que esperas subir un hotfix esta tarde y que avisarás por Slack.", ["I expect to push a hotfix this afternoon. I'll let you know on Slack.", "I should have a hotfix ready this afternoon, and I'll update you on Slack.", "Hopefully this afternoon. I'll post an update on Slack."]]
  ]},
  { title: "Desacuerdo en un code review", intro: "Un compañero comentó tu PR y no estás de acuerdo con su sugerencia.", turns: [
    ["I left a comment on your PR. I think we should use a different library for dates.", "Agradece y pregunta cuál es el motivo.", ["Thanks for the review. Could you explain the reasoning?", "Thanks! What's the main reason for changing it?", "Thanks for taking a look. Why do you think we should change it?"]],
    ["The one you used is quite heavy. It adds about two hundred kilobytes to the bundle.", "Reconoce el punto, pero di que la otra no soporta zonas horarias.", ["That's a good point, but the other one doesn't support time zones.", "Fair point. However, the alternative doesn't handle time zones.", "I see your point, but the lighter library doesn't support time zones, which we need."]],
    ["Hmm, that's true. Time zones are important for this feature.", "Propón mantenerla por ahora y crear un ticket para evaluar alternativas.", ["What if we keep it for now and create a ticket to evaluate alternatives?", "Maybe we can keep it for this release and open a ticket to look into lighter options.", "How about keeping it for now and addressing it in a follow-up?"]],
    ["Sounds good. Can you also add a test for the date formatting?", "Acepta y di que lo agregarás en el siguiente commit.", ["Sure, I'll add it in the next commit.", "Good idea. I'll add a test in the next commit.", "Absolutely, I'll push a test shortly."]],
    ["Great, I'll approve it after that.", "Agradece la revisión.", ["Thanks for the great review!", "Thanks, I appreciate the feedback!", "Thank you, good catch on the bundle size!"]]
  ]},
  { title: "Entrevista: preguntas de comportamiento", intro: "Entrevista con una empresa de Estados Unidos para un puesto remoto.", turns: [
    ["Thanks for joining. To start, tell me a bit about yourself.", "Di que eres desarrollador con cuatro años de experiencia en backend con Java y que trabajas en una empresa de seguros.", ["I'm a developer with four years of experience in backend development with Java. I currently work at an insurance company.", "I've been working as a backend developer for four years, mainly with Java, and right now I'm at an insurance company.", "I'm a backend developer with four years of experience, mostly in Java, currently working for an insurance company."]],
    ["What's a project you're proud of?", "Di que lideraste la migración de un sistema antiguo a microservicios.", ["I'm proud of leading the migration of a legacy system to microservices.", "I led the migration of an old monolith to microservices, and I'm really proud of it.", "One project I'm proud of is the migration of our legacy system to microservices, which I led."]],
    ["What was the result?", "Di que el tiempo de despliegue bajó de horas a minutos.", ["Deployment time went down from hours to minutes.", "We reduced the deployment time from several hours to a few minutes.", "As a result, deployments now take minutes instead of hours."]],
    ["Impressive. Why are you looking for a new opportunity?", "Di que buscas un equipo internacional y retos técnicos más grandes.", ["I'm looking for an international team and bigger technical challenges.", "I want to work with an international team and take on bigger technical challenges.", "I'd like to grow in an international environment with more complex technical challenges."]],
    ["Do you have any questions for me?", "Pregunta cómo es el proceso de trabajo del equipo.", ["Yes, what does the team's workflow look like?", "Could you tell me a bit about how the team works day to day?", "Yes, how does the team usually plan and organise its work?"]]
  ]},
  { title: "Aclarar requerimientos con el Product Owner", intro: "Te asignaron una historia de usuario poco clara.", turns: [
    ["So, the new feature is to let users export their reports. Any questions?", "Pregunta en qué formato necesitan la exportación.", ["Just to make sure I understand, which format do you need: CSV or PDF?", "What format should the export be in?", "Which formats do users need for the export?"]],
    ["CSV is enough for now.", "Pregunta qué debe pasar si el reporte está vacío.", ["What should happen if the report is empty?", "What's the expected behavior when there's no data?", "And what should we show if the report is empty?"]],
    ["Good question. Just show a message saying there's no data.", "Pregunta si hay un límite de filas.", ["Is there a limit on the number of rows?", "Should we set a maximum number of rows?", "Do we need a limit for very large reports?"]],
    ["Hmm, I'm not sure. Some reports can have a million rows.", "Sugiere generar los reportes grandes en segundo plano y enviarlos por correo.", ["We could generate large reports in the background and send them by email.", "For large reports, I suggest processing them in the background and emailing a link.", "Maybe large exports could run in the background and be sent by email."]],
    ["That's a great idea. How long do you think it'll take?", "Di que lo estimarías en cinco puntos y que mañana das un estimado más preciso.", ["I'd estimate it at about five points, but I'll give you a more accurate estimate tomorrow.", "Probably around five story points. I'll confirm tomorrow.", "Roughly five points; I'll have a better estimate tomorrow."]]
  ]},
  { title: "Negociar una fecha de entrega", intro: "Tu gerente quiere una funcionalidad para el viernes y no es realista.", turns: [
    ["The client wants the new dashboard by Friday. Can we make it?", "Di con cortesía que no crees que se pueda terminar todo para el viernes.", ["I don't think we can finish everything by Friday.", "To be honest, I don't think we can deliver the whole dashboard by Friday.", "I'm afraid it isn't realistic to finish all of it by Friday."]],
    ["Why not? It looks simple.", "Explica que hay que integrar tres fuentes de datos y todavía hay incógnitas.", ["We need to integrate three data sources, and there are still some unknowns.", "It requires integrating three different data sources, and some things are still unclear.", "There are three data sources to integrate, and we still have some unknowns."]],
    ["What can we deliver by Friday, then?", "Propón entregar una primera versión con los dos gráficos principales.", ["We could deliver a first version with the two main charts.", "By Friday we can ship an MVP with the two main charts.", "I suggest delivering a first version with the two most important charts."]],
    ["And the rest?", "Di que el resto estaría listo para el siguiente sprint.", ["The rest would be ready in the next sprint.", "We could finish the rest in the following sprint.", "The remaining parts would be done next sprint."]],
    ["OK, I'll talk to the client. Thanks for being clear.", "Di que le enviarás un resumen por correo hoy.", ["No problem. I'll send you a summary by email today.", "Thanks. I'll follow up with an email summary today.", "Sure. I'll send you the details in writing today."]]
  ]}
];

DEV.listening = [
  { title: "Daily stand-up del equipo", lines: [["A", "Morning, everyone. Let's keep it quick. Carlos, you go first."], ["B", "Sure. Yesterday I finished the search filters and opened a pull request. Today I'm going to fix the comments from the review."], ["A", "Any blockers?"], ["B", "Not really, but I need someone to approve the PR by noon so I can merge it before the release."], ["C", "I can take a look after this meeting."], ["A", "Great, thanks Sara. And you, Sara?"], ["C", "I've been working on the login timeout issue. I think it's related to the token refresh. I'll pair with the backend team today."], ["A", "Perfect. Let's take the release details offline."]], q: [
    ["What did Carlos finish yesterday?", ["The login page", "The search filters", "The release notes", "The token refresh"], 1],
    ["What does Carlos need?", ["More time", "Someone to approve his PR by noon", "A new laptop", "Access to production"], 1],
    ["What does Sara think causes the login issue?", ["The database", "The token refresh", "The network", "A missing test"], 1],
    ["What will Sara do today?", ["Work alone", "Pair with the backend team", "Deploy the release", "Write documentation"], 1]
  ]},
  { title: "Llamada por una caída en producción", lines: [["A", "Thanks for jumping on the call. The API has been returning errors for about fifteen minutes."], ["B", "I'm looking at the logs now. It looks like the database connections are maxed out."], ["A", "Did anything change recently?"], ["B", "We deployed a new version an hour ago. It might have introduced a connection leak."], ["A", "Should we roll back?"], ["B", "I think that's the safest option. I'll roll back now and we can investigate the root cause afterwards."], ["A", "OK. I'll post an update on the status page so customers know we're working on it."], ["B", "Rollback is done. Errors are going down already."]], q: [
    ["How long has the API been failing?", ["Five minutes", "Fifteen minutes", "An hour", "All day"], 1],
    ["What do the logs show?", ["High CPU usage", "Database connections are maxed out", "Disk is full", "Wrong passwords"], 1],
    ["What do they decide to do?", ["Restart the servers", "Roll back the deployment", "Add more databases", "Wait"], 1],
    ["What will A do to inform customers?", ["Send emails", "Post an update on the status page", "Call them", "Nothing"], 1]
  ]},
  { title: "Inicio de una entrevista técnica", lines: [["A", "Hi, thanks for taking the time to talk with us today. Can you hear me okay?"], ["B", "Yes, perfectly, thanks. And thank you for the opportunity."], ["A", "Great. So the plan for today is about forty-five minutes. First, I'll ask you a few questions about your experience, then we'll do a short coding exercise, and we'll leave ten minutes at the end for your questions."], ["B", "Sounds good."], ["A", "For the coding part, feel free to think out loud. We care more about how you approach the problem than about getting a perfect solution."], ["B", "That's good to know. Can I use the language I'm most comfortable with?"], ["A", "Of course. Most candidates use JavaScript or Python, but any language is fine."]], q: [
    ["How long is the interview?", ["30 minutes", "45 minutes", "One hour", "Two hours"], 1],
    ["What will happen after the experience questions?", ["A personality test", "A short coding exercise", "A salary negotiation", "A team lunch"], 1],
    ["What does the interviewer value most in the coding part?", ["Speed", "A perfect solution", "How the candidate approaches the problem", "Using Python"], 2],
    ["Which language can the candidate use?", ["Only JavaScript", "Only Python", "Any language", "Java"], 2]
  ]},
  { title: "Sprint planning", lines: [["A", "OK, let's look at the backlog. The top priority is the notification system."], ["B", "How many points do we think it is?"], ["C", "I'd say eight. There are a lot of edge cases with email and push notifications."], ["B", "That sounds high. Could we break it down?"], ["C", "Sure. We could split it into email notifications first and push notifications next sprint."], ["A", "I like that. Email is what the client needs most."], ["B", "Then email would be about five points, and push maybe three."], ["A", "Great. Let's commit to the email part this sprint."]], q: [
    ["What is the top priority?", ["The login page", "The notification system", "Performance", "The dashboard"], 1],
    ["Why did C estimate eight points?", ["Too many meetings", "Many edge cases", "The client is difficult", "Lack of developers"], 1],
    ["What do they decide?", ["Do everything this sprint", "Split it: email first, push later", "Cancel the feature", "Hire someone"], 1],
    ["How many points is the email part?", ["Three", "Five", "Eight", "Thirteen"], 1]
  ]}
];

DEV.readings = [
  { title: "Job description: Senior Backend Engineer (Remote)", text: `We're looking for a Senior Backend Engineer to join our platform team. You'll design, build and maintain the APIs that power our mobile and web applications, used by more than two million people across Latin America.\n\nWhat you'll do: build scalable services in Node.js and Go; collaborate closely with product managers and designers to turn requirements into technical solutions; review code and mentor mid-level engineers; take part in an on-call rotation once every six weeks.\n\nWhat we're looking for: five or more years of experience in backend development; strong knowledge of SQL databases and caching strategies; experience with cloud platforms, ideally AWS; excellent written and spoken English, as you'll work with teams in the United States and Europe.\n\nNice to have: experience with event-driven architectures; contributions to open-source projects.\n\nWhat we offer: a fully remote position, a competitive salary in US dollars, a yearly learning budget and flexible working hours.`, q: [
    ["What will the engineer mainly build?", ["Mobile apps", "APIs for mobile and web apps", "Marketing websites", "Data reports"], 1],
    ["How often is the on-call rotation?", ["Every week", "Once a month", "Once every six weeks", "Never"], 2],
    ["Why is English important for this role?", ["To write blog posts", "To work with teams in the US and Europe", "To travel", "To teach classes"], 1],
    ["What does 'nice to have' mean?", ["Required", "Not required, but a plus", "Forbidden", "Paid extra"], 1],
    ["Which of these is NOT offered?", ["Remote work", "Salary in dollars", "Learning budget", "Company car"], 3]
  ], gloss: [["power", "impulsar / hacer funcionar"], ["turn into", "convertir en"], ["mentor", "guiar / ser mentor"], ["on-call rotation", "turnos de guardia"], ["nice to have", "deseable (no obligatorio)"], ["learning budget", "presupuesto para formación"]] },
  { title: "Postmortem: checkout outage", text: `Summary: On March 14, the checkout service was unavailable for 42 minutes. During this time, about 3,200 customers were unable to complete their purchases.\n\nTimeline: At 14:05, a new version of the payment service was deployed. At 14:12, monitoring alerts showed a sharp increase in error rates. The on-call engineer started investigating at 14:15. At 14:40, the team decided to roll back the deployment, and the service fully recovered at 14:47.\n\nRoot cause: The new version introduced a connection leak. Database connections were opened but never closed, so the connection pool was exhausted after a few minutes of normal traffic.\n\nWhat went well: Alerts were triggered quickly, and the rollback process worked as expected.\n\nWhat went wrong: The issue was not detected in staging because staging traffic is much lower than production traffic. It also took 25 minutes to decide to roll back.\n\nAction items: add load tests to the deployment pipeline; create a rule to roll back automatically if error rates exceed 5%; add a check for unclosed connections in code reviews.`, q: [
    ["How long was the service down?", ["14 minutes", "25 minutes", "42 minutes", "One hour"], 2],
    ["What was the root cause?", ["A network failure", "A connection leak", "A hacker attack", "A missing server"], 1],
    ["Why wasn't the problem found in staging?", ["Nobody tested it", "Staging traffic is much lower", "Staging was down", "The tests were flaky"], 1],
    ["What is one thing that went well?", ["The rollback worked as expected", "Nobody was affected", "The deploy was fast", "Customers were notified by phone"], 0],
    ["Which is an action item?", ["Hire more engineers", "Add load tests to the pipeline", "Stop deploying on Fridays", "Remove monitoring"], 1]
  ], gloss: [["outage", "caída del servicio"], ["sharp increase", "aumento brusco"], ["connection leak", "fuga de conexiones"], ["exhausted", "agotado"], ["triggered", "disparado / activado"], ["action items", "acciones a realizar"]] },
  { title: "README: quick-cache library", text: `quick-cache is a lightweight in-memory cache for Node.js applications. It helps you reduce latency and database load by storing the results of expensive operations.\n\nInstallation: run npm install quick-cache. Node.js 18 or later is required.\n\nUsage: create a cache with a default time-to-live, or TTL, in seconds. Call the get method with a key; if the value is not cached, provide a function that loads it. The result will be stored and returned on the next call until it expires.\n\nConfiguration: you can set a maximum number of entries. When the limit is reached, the least recently used items are removed first. Setting the TTL to zero disables expiration, which is not recommended for data that changes often.\n\nContributing: pull requests are welcome. Please open an issue first to discuss what you would like to change, and make sure to update the tests as appropriate. This project is licensed under the MIT License.`, q: [
    ["What is the main purpose of quick-cache?", ["To store files on disk", "To reduce latency and database load", "To send emails", "To test code"], 1],
    ["What is the minimum Node.js version?", ["14", "16", "18", "20"], 2],
    ["What happens when the maximum number of entries is reached?", ["The app crashes", "The least recently used items are removed", "New items are rejected", "The TTL resets"], 1],
    ["What does a TTL of zero do?", ["Deletes everything", "Disables expiration", "Doubles the speed", "Nothing"], 1],
    ["What should you do before sending a pull request?", ["Email the author", "Open an issue to discuss it", "Change the license", "Delete the tests"], 1]
  ], gloss: [["lightweight", "ligero"], ["expensive operation", "operación costosa"], ["time-to-live (TTL)", "tiempo de vida"], ["least recently used", "usado hace más tiempo"], ["as appropriate", "según corresponda"], ["licensed under", "bajo la licencia"]] },
  { title: "Blog: How to write better pull requests", text: `A good pull request makes life easier for everyone on the team. Reviewers understand your changes faster, bugs are caught earlier, and the project history becomes a useful source of documentation.\n\nKeep it small. Large pull requests are hard to review, so they often receive superficial feedback. If a change touches many files, consider splitting it into several smaller pull requests that can be reviewed independently.\n\nWrite a clear description. Explain what the change does, why it is needed and how it was tested. Screenshots are extremely helpful for user interface changes. If there are parts you are unsure about, say so: it shows honesty and directs the reviewer's attention to where it matters most.\n\nRespond to feedback professionally. Comments on your code are not comments on you. Thank reviewers for their time, ask questions when something isn't clear, and don't be afraid to explain your reasoning if you disagree. The goal is not to win the discussion but to ship better software together.`, q: [
    ["Why are large pull requests a problem?", ["They are too fast", "They are hard to review and get superficial feedback", "They break Git", "They are expensive"], 1],
    ["What should a PR description include?", ["Only the title", "What, why and how it was tested", "The author's CV", "A joke"], 1],
    ["When are screenshots especially useful?", ["For database changes", "For user interface changes", "For tests", "Never"], 1],
    ["What does the author recommend if you are unsure about part of your code?", ["Hide it", "Say so in the description", "Delete it", "Ask a manager"], 1],
    ["What is the goal of a code review discussion?", ["Winning the argument", "Shipping better software together", "Finding someone to blame", "Making it longer"], 1]
  ], gloss: [["superficial", "superficial"], ["touch many files", "modificar muchos archivos"], ["split into", "dividir en"], ["say so", "decirlo"], ["directs attention", "dirige la atención"], ["ship", "entregar / lanzar"]] }
];

DEV.writing = [
  { title: "Mensajes de commit", task: "Escribe 4 mensajes de commit para estos cambios: corregiste un error al iniciar sesión con Google; agregaste paginación a la lista de productos; actualizaste la versión de React; eliminaste código que ya no se usaba.", words: "15–40", phrases: ["Fix ...", "Add ...", "Update ...", "Remove ...", "Refactor ..."], check: ["Cada mensaje empieza con un verbo en imperativo (Fix, Add...)", "Ninguno pasa de unas 50 letras", "Se entiende qué cambió sin leer el código", "No usé palabras vagas como 'stuff' o 'things'"], model: "Fix Google sign-in redirect loop\nAdd pagination to product list\nUpdate React to version 19\nRemove unused helper functions" },
  { title: "Reporte de un bug", task: "Escribe un bug report: en la app móvil, al subir una foto de perfil de más de 5 MB, la app se cierra. Debería mostrar un mensaje de error.", words: "60–100", phrases: ["Steps to reproduce:", "Expected behavior:", "Actual behavior:", "Environment:", "It happens every time / sometimes"], check: ["Tiene título claro", "Incluye pasos para reproducir numerados", "Separa comportamiento esperado y actual", "Indica el entorno (dispositivo, versión)"], model: "Title: App crashes when uploading a profile photo larger than 5 MB\n\nSteps to reproduce:\n1. Open the app and go to Profile.\n2. Tap 'Change photo'.\n3. Select an image larger than 5 MB.\n\nExpected behavior: The app shows an error message saying the image is too large.\n\nActual behavior: The app closes immediately without any message.\n\nEnvironment: Android 14, Samsung Galaxy A54, app version 3.2.1. It happens every time." },
  { title: "Descripción de un pull request", task: "Escribe la descripción de un PR en el que agregaste la opción de exportar reportes a CSV.", words: "70–120", phrases: ["This PR adds...", "Why:", "How to test:", "Notes:", "Screenshots:"], check: ["Explica qué hace el cambio", "Explica por qué se necesita", "Incluye cómo probarlo", "Menciona riesgos o dudas si los hay"], model: "This PR adds the option to export reports to CSV.\n\nWhy: Several clients asked to analyse their data in Excel, and this was the top request in the last survey.\n\nWhat changed:\n- New 'Export to CSV' button on the reports page.\n- New endpoint GET /reports/{id}/export.\n- Unit tests for the CSV generator.\n\nHow to test: Open any report, click 'Export to CSV' and check that the file opens correctly in Excel.\n\nNotes: Reports with more than 100,000 rows may be slow. I suggest handling large exports in the background in a follow-up PR." },
  { title: "Mensaje en Slack por un retraso", task: "Escribe un mensaje al canal del equipo avisando que la funcionalidad que prometiste para hoy se retrasará un día por un problema con la API externa.", words: "40–80", phrases: ["Heads-up:", "Unfortunately...", "because...", "The new ETA is...", "I'll keep you posted."], check: ["Avisa el problema desde el inicio", "Explica la causa brevemente", "Da una nueva fecha (ETA)", "Ofrece una acción o actualización"], model: "Heads-up: the payment integration won't be ready today as planned. Unfortunately, the provider's sandbox has been down since this morning, so I can't finish the tests. The new ETA is tomorrow at noon, assuming their API is back today. I've already contacted their support team, and I'll keep you posted. Sorry for the inconvenience!" },
  { title: "Correo a un reclutador", task: "Responde a un reclutador que te escribió por LinkedIn ofreciéndote un puesto remoto como desarrollador. Muestra interés, resume tu perfil y propone una llamada.", words: "90–140", phrases: ["Thank you for reaching out.", "I'm very interested in...", "I have X years of experience in...", "I'd be happy to schedule a call.", "Best regards,"], check: ["Agradece el contacto", "Resume tu experiencia en 2–3 frases", "Muestra interés concreto en el puesto", "Propone disponibilidad para una llamada", "Tono profesional y sin errores (pásalo por el corrector)"], model: "Hi Jessica,\n\nThank you for reaching out. I'm very interested in the Senior Frontend Developer position.\n\nI have five years of experience building web applications with React and TypeScript, and I currently work at a fintech company, where I lead the development of our customer dashboard. I'm particularly excited about this role because of your focus on accessibility and performance.\n\nI'd be happy to schedule a call to learn more. I'm available Monday to Thursday between 9 a.m. and 1 p.m. Colombian time (UTC-5).\n\nBest regards,\nDanilo Gómez" },
  { title: "Tu resumen de LinkedIn ('About')", task: "Escribe la sección 'About' de tu perfil de LinkedIn en inglés: quién eres, en qué tecnologías trabajas, un logro y qué buscas.", words: "80–150", phrases: ["I'm a ... developer with ... years of experience in...", "I specialise in...", "Recently, I...", "I'm passionate about...", "I'm open to..."], check: ["Empieza con tu rol y experiencia", "Menciona tus tecnologías principales", "Incluye un logro con impacto medible", "Termina diciendo qué oportunidades buscas"], model: "I'm a full-stack developer with five years of experience building web applications for fintech and e-commerce companies. I specialise in React, Node.js and cloud services on AWS.\n\nRecently, I led the migration of a legacy monolith to microservices, which reduced deployment time from hours to minutes and helped the team release new features weekly.\n\nI'm passionate about clean code, good developer experience and mentoring junior developers.\n\nI'm currently open to remote opportunities with international teams where I can keep growing as a technical leader." }
];
