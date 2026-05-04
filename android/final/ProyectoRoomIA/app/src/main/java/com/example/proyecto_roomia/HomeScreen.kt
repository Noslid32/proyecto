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
    var busquedaActiva by remember { mutableStateOf("") }

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

    //Cargar cuartos desde la API
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

    //GeoPoints dinámicos desde la API
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
            if (busquedaActiva.isNotEmpty() && !isSearching) {
                Surface(
                    color = Color(0xFFE8F0FE),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .padding(top = 80.dp)
                        .align(Alignment.TopCenter)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp).fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("✨ Resultados Inteligentes", fontWeight = FontWeight.Bold, color = Color(0xFF1A8FFF), fontSize = 14.sp)
                            Text("Para: \"$busquedaActiva\"", fontSize = 12.sp, color = Color.DarkGray)
                        }

                        // Botón para limpiar la búsqueda
                        TextButton(onClick = {
                            searchText = ""
                            busquedaActiva = ""
                            scope.launch { cuartos = CuartoRepository.getCuartos() }
                        }) {
                            Text("Ver todos", color = Color(0xFF1A8FFF))
                        }
                    }
                }
            }
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
                update = { mapView ->
                    mapView.controller.setCenter(userLocation)
                    mapView.overlays.removeIf { it is Marker }

                    // Dibuja marcadores nuevos desde la API
                    cuartos.forEach { cuarto ->
                        val marker = Marker(mapView)
                        marker.position = GeoPoint(cuarto.latitude, cuarto.longitude)
                        marker.title = cuarto.style
                        marker.relatedObject = cuarto
                        marker.infoWindow = null
                        marker.setOnMarkerClickListener { m, _ ->
                            // Extraemos el cuarto del marcador
                            val cuartoClick = m.relatedObject as? Cuarto
                            cuartoSeleccionado = cuartoClick

                            // Registramos la visita en el backend
                            cuartoClick?.let {
                                scope.launch {
                                    CuartoRepository.registrarInteraccion(it.id, views = 1)
                                }
                            }
                            mapView.controller.animateTo(m.position)
                            true
                        }

                        mapView.overlays.add(marker)
                    }
                    mapView.invalidate()
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
                                        // Llamamos a la funcion para buscar cuartos con IA
                                        cuartos = CuartoRepository.buscarCuartosConIA(searchText)
                                        busquedaActiva = searchText
                                        isSearching = false
                                    }
                                } else {
                                    scope.launch { cuartos = CuartoRepository.getCuartos()
                                    busquedaActiva = "" }
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
                }

                if (showResponse) {
                    Spacer(modifier = Modifier.height(8.dp))
                    if (busquedaActiva.isNotEmpty()) {
                        AssistChip(
                            onClick = {},
                            label = { Text("✨ Match de IA", color = Color(0xFF673AB7), fontSize = 12.sp) },
                            colors = AssistChipDefaults.assistChipColors(containerColor = Color(0xFFF3E5F5))
                        )
                    }
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
                            // Coil para cargar la imagen del cuarto
                            if (cuarto.imageUrls.isNotEmpty()) {
                                AsyncImage(
                                    model = cuarto.imageUrls[0],
                                    contentDescription = "Foto principal de la habitación",
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp),
                                    contentScale = ContentScale.Crop
                                )
                            } else {
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
                                        val esFavorito = cuarto.id in favoritosIds

                                        IconButton(onClick = {
                                            user?.uid?.let { uid ->

                                                db.collection("favoritos")
                                                    .whereEqualTo("usuarioId", uid)
                                                    .whereEqualTo("cuartoId", cuarto.id)
                                                    .get()
                                                    .addOnSuccessListener { docs ->

                                                        if (docs.isEmpty) {
                                                            val favorito = hashMapOf(
                                                                "usuarioId" to uid,
                                                                "cuartoId" to cuarto.id
                                                            )
                                                            db.collection("favoritos").add(favorito)
                                                            favoritosIds = favoritosIds + cuarto.id

                                                        } else {
                                                            docs.forEach { it.reference.delete() }
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

                                // Flecha para leer la descripcion
                                var expandido by remember { mutableStateOf(false) }

                                Column(modifier = Modifier.fillMaxWidth()) {
                                    Text(
                                        text = cuarto.aiDescription,
                                        fontSize = 14.sp,
                                        color = Color.Gray,
                                        maxLines = if (expandido) 100 else 2,
                                        overflow = TextOverflow.Ellipsis
                                    )

                                    IconButton(
                                        onClick = { expandido = !expandido },
                                        modifier = Modifier
                                            .align(Alignment.CenterHorizontally)
                                            .size(30.dp)
                                    ) {
                                        Icon(
                                            imageVector = if (expandido) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                            contentDescription = "Ver más",
                                            tint = Color(0xFF1A8FFF)
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceEvenly
                                ) {
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