package com.example.proyecto_roomia

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.proyecto_roomia.Cuarto
import com.example.proyecto_roomia.components.AppBottomBar
import com.example.proyecto_roomia.navigation.Screen
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import androidx.compose.runtime.Composable

@Composable
fun FavoritesScreen(navController: NavController) {
    val auth = FirebaseAuth.getInstance()
    val db = FirebaseFirestore.getInstance()
    val user = auth.currentUser

    // Todos los cuartos disponibles (estáticos por ahora)
    val todosCuartos = listOf(
        Cuarto(id = "1", style = "Moderno", location = "Zona 10 - Oakland Mall",
            price = "Q500", area = "20m²",
            aiDescription = "Cuarto amplio con baño privado, ideal para estudiantes."),
        Cuarto(id = "2", style = "Minimalista", location = "Zona 10 - Cayalá",
            price = "Q600", area = "25m²",
            aiDescription = "Habitación amueblada con WiFi incluido."),
        Cuarto(id = "3", style = "Industrial", location = "Zona 10 - Zona Viva",
            price = "Q700", area = "30m²",
            aiDescription = "Estudio completo con kitchenette."),
    )

    var favoritosIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var isLoading by remember { mutableStateOf(true) }

    // Cargar favoritos del usuario actual desde Firestore
    LaunchedEffect(user?.uid) {
        user?.uid?.let { uid ->
            db.collection("favoritos")
                .whereEqualTo("usuarioId", uid)
                .get()
                .addOnSuccessListener { docs ->
                    favoritosIds = docs.map { it.getString("cuartoId") ?: "" }.toSet()
                    isLoading = false
                }
                .addOnFailureListener {
                    isLoading = false
                }
        } ?: run { isLoading = false }
    }

    // Filtrar solo los cuartos que el usuario marcó como favorito
    val cuartosFavoritos = todosCuartos.filter { it.id in favoritosIds }

    Scaffold(
        bottomBar = { AppBottomBar(navController, Screen.Favorites.route) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text("Guardados", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "${cuartosFavoritos.size} cuartos guardados",
                color = Color.Gray,
                fontSize = 14.sp
            )
            Spacer(modifier = Modifier.height(16.dp))

            when {
                isLoading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Color(0xFF1A8FFF))
                    }
                }
                cuartosFavoritos.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                Icons.Default.Favorite,
                                contentDescription = null,
                                tint = Color.LightGray,
                                modifier = Modifier.size(64.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("No tienes cuartos guardados", color = Color.Gray)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "Toca el corazón en el mapa para guardar",
                                color = Color.LightGray,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
                else -> {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(cuartosFavoritos) { cuarto ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                elevation = CardDefaults.cardElevation(4.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = cuarto.style.ifEmpty { "Cuarto en renta" },
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 18.sp
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(
                                                    Icons.Default.LocationOn,
                                                    contentDescription = null,
                                                    tint = Color(0xFF1A8FFF),
                                                    modifier = Modifier.size(16.dp)
                                                )
                                                Text(
                                                    cuarto.location,
                                                    fontSize = 13.sp,
                                                    color = Color.Gray
                                                )
                                            }
                                        }
                                        IconButton(onClick = {
                                            user?.uid?.let { uid ->
                                                db.collection("favoritos")
                                                    .whereEqualTo("usuarioId", uid)
                                                    .whereEqualTo("cuartoId", cuarto.id)
                                                    .get()
                                                    .addOnSuccessListener { docs ->
                                                        docs.forEach { it.reference.delete() }
                                                        favoritosIds = favoritosIds - cuarto.id
                                                    }
                                            }
                                        }) {
                                            Icon(
                                                Icons.Default.Favorite,
                                                contentDescription = "Quitar favorito",
                                                tint = Color.Red
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = cuarto.aiDescription,
                                        fontSize = 14.sp,
                                        color = Color.DarkGray
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        AssistChip(
                                            onClick = {},
                                            label = {
                                                Text(
                                                    cuarto.price,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Color(0xFF1A8FFF)
                                                )
                                            }
                                        )
                                        AssistChip(
                                            onClick = {},
                                            label = { Text(cuarto.area) }
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
}