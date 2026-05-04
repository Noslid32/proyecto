package com.example.proyecto_roomia

import android.Manifest
import android.content.pm.PackageManager
import android.preference.PreferenceManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import com.example.proyecto_roomia.components.AppBottomBar
import com.example.proyecto_roomia.navigation.Screen
import com.google.android.gms.location.LocationServices
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import coil.compose.AsyncImage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

@Composable
fun HomeScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val auth = FirebaseAuth.getInstance()
    val db = FirebaseFirestore.getInstance()
    val user = auth.currentUser
    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }
    val client = remember {
        OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .build()
    }

    Configuration.getInstance().load(
        context,
        PreferenceManager.getDefaultSharedPreferences(context)
    )

    var userLocation by remember { mutableStateOf(GeoPoint(14.6058, -90.5128)) }
    var searchQuery by remember { mutableStateOf("") }
    var aiResponse by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var showResponse by remember { mutableStateOf(false) }
    var cuartoSeleccionado by remember { mutableStateOf<Cuarto?>(null) }
    var favoritosIds by remember { mutableStateOf<Set<String>>(emptySet()) }

    var searchText by remember { mutableStateOf("") }
    var isSearching by remember { mutableStateOf(false) }

    // ← NUEVO: cuartos dinámicos desde la API
    var cuartos by remember { mutableStateOf<List<Cuarto>>(emptyList()) }

    var locationPermissionGranted by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context, Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        locationPermissionGranted = granted
    }

    // ← NUEVO: Cargar cuartos desde la API al iniciar
    LaunchedEffect(Unit) {
        cuartos = CuartoRepository.getCuartos()
    }

    // Cargar favoritos del usuario
    LaunchedEffect(user?.uid) {
        user?.uid?.let { uid ->
            db.collection("favoritos")
                .whereEqualTo("usuarioId", uid)
                .get()
                .addOnSuccessListener { docs ->
                    favoritosIds = docs.map { it.getString("cuartoId") ?: "" }.toSet()
                }
        }
    }

    LaunchedEffect(Unit) {
        if (!locationPermissionGranted) {
            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                location?.let {
                    userLocation = GeoPoint(it.latitude, it.longitude)
                }
            }
        }
    }

    // ← NUEVO: GeoPoints dinámicos desde la API (reemplaza la lista estática)
    val cuartoGeoPoints = cuartos.map { cuarto ->
        Pair(cuarto, GeoPoint(cuarto.latitude, cuarto.longitude))
    }

    Scaffold(
        bottomBar = { AppBottomBar(navController, Screen.Home.route) }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { ctx ->
                    MapView(ctx).apply {
                        setTileSource(TileSourceFactory.MAPNIK)
                        setMultiTouchControls(true)
                        controller.setZoom(15.0)
                        controller.setCenter(userLocation)

                        val myLocationOverlay = MyLocationNewOverlay(
                            GpsMyLocationProvider(ctx), this
                        )
                        myLocationOverlay.enableMyLocation()
                        myLocationOverlay.enableFollowLocation()
                        overlays.add(myLocationOverlay)
                    }
                },
                // ← NUEVO: update redibuja los pines cuando llegan los cuartos
                update = { mapView ->
                    mapView.controller.setCenter(userLocation)

                    // Limpia marcadores viejos
                    mapView.overlays.removeIf { it is Marker }

                    // Dibuja marcadores nuevos desde la API
                    cuartos.forEach { cuarto ->
                        val marker = Marker(mapView)
                        marker.position = GeoPoint(cuarto.latitude, cuarto.longitude)
                        marker.title = cuarto.style

                        // Guardamos el objeto completo para recuperarlo luego
                        marker.relatedObject = cuarto

                        // Quitamos la ventanita blanca fea que sale por defecto
                        marker.infoWindow = null

                        // ESTE ES EL MOTOR QUE ABRE LA TARJETA
                        marker.setOnMarkerClickListener { m, _ ->
                            // 1. Extraemos el cuarto del marcador
                            val cuartoClick = m.relatedObject as? Cuarto

                            // 2. Le decimos a Compose: "¡Hey, este es el seleccionado!"
                            cuartoSeleccionado = cuartoClick

                            // 3. Registramos la visita en el backend (tu nueva función)
                            cuartoClick?.let {
                                scope.launch {
                                    CuartoRepository.registrarInteraccion(it.id, views = 1)
                                }
                            }

                            // 4. Centramos el mapa un poquito para que se vea bien
                            mapView.controller.animateTo(m.position)

                            true // Indica que nosotros manejamos el clic
                        }

                        mapView.overlays.add(marker)
                    }
                    mapView.invalidate() // refresca el mapa
                }
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = "RoomIA",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1A8FFF)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = searchText,
                        onValueChange = { searchText = it },
                        placeholder = { Text("Ej. Lugar tranquilo para leer...") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        shape = RoundedCornerShape(24.dp),
                        colors = TextFieldDefaults.colors(
                            unfocusedContainerColor = Color.White,
                            focusedContainerColor = Color.White
                        ),
                        trailingIcon = {
                            IconButton(onClick = {
                                if (searchText.isNotEmpty()) {
                                    isSearching = true
                                    scope.launch {
                                        // Llamamos a la magia de la IA
                                        cuartos = CuartoRepository.buscarCuartosConIA(searchText)
                                        isSearching = false
                                    }
                                } else {
                                    // Si limpia el texto, recargamos todos los cuartos
                                    scope.launch { cuartos = CuartoRepository.getCuartos() }
                                }
                            }) {
                                if (isSearching) {
                                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                                } else {
                                    Icon(Icons.Default.Search, contentDescription = "Buscar con IA", tint = Color(0xFF1A8FFF))
                                }
                            }
                        }
                    )

                    Spacer(modifier = Modifier.width(8.dp))
                    FloatingActionButton(
                        onClick = {
                            if (searchQuery.isNotEmpty()) {
                                isLoading = true
                                showResponse = true
                                scope.launch {
                                    isLoading = true
                                    showResponse = true

                                    // 1. Usa una API Key limpia y el modelo estable 1.5-flash
                                    val apiKey = "AIzaSyARrDcNgn6xlFgJSWhsA4y5ZZZKvWrxPKU"
                                    val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"

                                    // 2. Construcción segura del JSON (evita errores de comillas)
                                    val jsonRequest = JSONObject().apply {
                                        put("contents", org.json.JSONArray().put(
                                            JSONObject().put("parts", org.json.JSONArray().put(
                                                JSONObject().put("text", "Eres un asistente de RoomIA, app de renta de cuartos en Guatemala. El usuario pregunta: $searchQuery. Responde brevemente.")
                                            ))
                                        ))
                                    }

                                    var intentos = 0
                                    var exito = false

                                    while (intentos < 3 && !exito) {
                                        try {
                                            val body = jsonRequest.toString().toRequestBody("application/json".toMediaType())
                                            val request = Request.Builder().url(url).post(body).build()

                                            val response = withContext(Dispatchers.IO) {
                                                client.newCall(request).execute()
                                            }

                                            val responseText = response.body?.string() ?: ""

                                            if (response.isSuccessful) {
                                                val jsonObj = JSONObject(responseText)
                                                val candidates = jsonObj.optJSONArray("candidates")
                                                if (candidates != null && candidates.length() > 0) {
                                                    aiResponse = candidates.getJSONObject(0)
                                                        .getJSONObject("content")
                                                        .getJSONArray("parts")
                                                        .getJSONObject(0)
                                                        .getString("text")
                                                    exito = true
                                                }
                                            } else {
                                                // Si falla, guardamos el código de error para saber qué pasa (400, 403, 404)
                                                println("Error API Gemini: ${response.code} - $responseText")
                                                intentos++
                                                delay(2000)
                                            }
                                        } catch (e: Exception) {
                                            println("Error de Red: ${e.message}")
                                            intentos++
                                            delay(2000)
                                        }
                                    }

                                    if (!exito) {
                                        aiResponse = "No pude conectar con RoomIA. Revisa tu conexión o API Key."
                                    }
                                    isLoading = false
                                }
                            }
                        },
                        containerColor = Color(0xFF1A8FFF),
                        modifier = Modifier.size(48.dp)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = "Enviar", tint = Color.White)
                    }
                }

                if (showResponse) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = Color.White.copy(alpha = 0.95f)
                        )
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("🤖 RoomIA AI", fontWeight = FontWeight.Bold, color = Color(0xFF1A8FFF))
                                TextButton(onClick = { showResponse = false }) {
                                    Text("✕", color = Color.Gray)
                                }
                            }
                            if (isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(24.dp),
                                    color = Color(0xFF1A8FFF)
                                )
                            } else {
                                Text(aiResponse, fontSize = 14.sp)
                            }
                        }
                    }
                }
            }

            // Tarjeta del cuarto seleccionado
            if (cuartoSeleccionado != null) {
                val cuarto = cuartoSeleccionado!!

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    contentAlignment = Alignment.BottomCenter
                ) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Column {
                            // 1. IMAGEN DE PORTADA DEL CUARTO (Usando Coil)
                            if (cuarto.imageUrls.isNotEmpty()) {
                                AsyncImage(
                                    model = cuarto.imageUrls[0], // Tomamos la primera foto
                                    contentDescription = "Foto principal de la habitación",
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp), // Altura fija
                                    contentScale = ContentScale.Crop // Recorta la imagen para llenar el espacio
                                )
                            } else {
                                // Si por alguna razón no hay fotos
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("Sin imagen disponible", color = Color.Gray)
                                }
                            }


                            Column(modifier = Modifier.padding(16.dp)) {
                                // ... (Nombre y botones de arriba se quedan igual) ...
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = cuarto.style.ifEmpty { "Habitación" },
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                    Row {
                                        //  REEMPLAZA SOLO LA PARTE DEL BOTÓN DE FAVORITOS EN HomeScreen

                                        val esFavorito = cuarto.id in favoritosIds

                                        IconButton(onClick = {
                                            user?.uid?.let { uid ->

                                                db.collection("favoritos")
                                                    .whereEqualTo("usuarioId", uid)
                                                    .whereEqualTo("cuartoId", cuarto.id)
                                                    .get()
                                                    .addOnSuccessListener { docs ->

                                                        if (docs.isEmpty) {
                                                            //AGREGAR A FAVORITOS
                                                            val favorito = hashMapOf(
                                                                "usuarioId" to uid,
                                                                "cuartoId" to cuarto.id
                                                            )

                                                            db.collection("favoritos").add(favorito)

                                                            // actualizar UI
                                                            favoritosIds = favoritosIds + cuarto.id

                                                        } else {
                                                            // QUITAR DE FAVORITOS
                                                            docs.forEach { it.reference.delete() }

                                                            // actualizar UI
                                                            favoritosIds = favoritosIds - cuarto.id
                                                        }
                                                    }
                                            }
                                        }) {
                                            Icon(
                                                imageVector = if (esFavorito) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                                contentDescription = null,
                                                tint = if (esFavorito) Color.Red else Color.Gray
                                            )
                                        }


// 🔥 ASEGÚRATE DE TENER ESTO EN TU HomeScreen (YA LO TIENES PERO CONFIRMAR)

                                        LaunchedEffect(user?.uid) {
                                            user?.uid?.let { uid ->
                                                db.collection("favoritos")
                                                    .whereEqualTo("usuarioId", uid)
                                                    .get()
                                                    .addOnSuccessListener { docs ->
                                                        favoritosIds = docs.map { it.getString("cuartoId") ?: "" }.toSet()
                                                    }
                                            }
                                        }

                                        IconButton(onClick = { cuartoSeleccionado = null }) {
                                            Text("✕", color = Color.Gray, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF1A8FFF), modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(cuarto.location, fontSize = 13.sp, color = Color.DarkGray)
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                // --- NUEVA LÓGICA DE DESCRIPCIÓN CON FLECHA ---
                                var expandido by remember { mutableStateOf(false) }

                                Column(modifier = Modifier.fillMaxWidth()) {
                                    Text(
                                        text = cuarto.aiDescription,
                                        fontSize = 14.sp,
                                        color = Color.Gray,
                                        // Si expandido es true, ponemos un número gigante de líneas. Si no, solo 2.
                                        maxLines = if (expandido) 100 else 2,
                                        overflow = TextOverflow.Ellipsis
                                    )

                                    // Flechita para expandir/colapsar
                                    IconButton(
                                        onClick = { expandido = !expandido },
                                        modifier = Modifier
                                            .align(Alignment.CenterHorizontally)
                                            .size(30.dp) // Tamaño pequeño para que no estorbe
                                    ) {
                                        Icon(
                                            imageVector = if (expandido) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                            contentDescription = "Ver más",
                                            tint = Color(0xFF1A8FFF) // Color azul para que resalte que es clickeable
                                        )
                                    }
                                }
                                // ----------------------------------------------

                                Spacer(modifier = Modifier.height(12.dp))

// FILA DE BOTONES DE INTERACCIÓN
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceEvenly // Los centra y separa igual
                                ) {
                                    // Botón de Compartir (Link)
                                    Button(
                                        onClick = {
                                            scope.launch {
                                                CuartoRepository.registrarInteraccion(cuarto.id, shares = 1)
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE3F2FD)), // Azul muy clarito
                                        shape = RoundedCornerShape(12.dp)
                                    ) {
                                        Icon(Icons.Default.Share, contentDescription = null, tint = Color(0xFF1A8FFF), modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Compartir", color = Color(0xFF1A8FFF), fontSize = 12.sp)
                                    }

                                    // Botón de Contacto (Teléfono)
                                    Button(
                                        onClick = {
                                            scope.launch {
                                                CuartoRepository.registrarInteraccion(cuarto.id, contacts = 1)
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE8F5E9)), // Verde muy clarito
                                        shape = RoundedCornerShape(12.dp)
                                    ) {
                                        Icon(Icons.Default.Phone, contentDescription = null, tint = Color(0xFF2E7D32), modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Contactar", color = Color(0xFF2E7D32), fontSize = 12.sp)
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // 3. CHIPS DE PRECIO Y ÁREA
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("Q ${cuarto.price}", fontWeight = FontWeight.Bold) },
                                        leadingIcon = { Text("💰", fontSize = 14.sp) }
                                    )
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("${cuarto.area} m²", fontWeight = FontWeight.Bold) },
                                        leadingIcon = { Text("📏", fontSize = 14.sp) }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}