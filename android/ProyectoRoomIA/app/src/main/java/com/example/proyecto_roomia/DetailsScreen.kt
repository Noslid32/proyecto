package com.example.proyecto_roomia.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.proyecto_roomia.components.AppBottomBar
import com.example.proyecto_roomia.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailsScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detalles del cuarto") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás")
                    }
                }
            )
        },
        bottomBar = { AppBottomBar(navController, Screen.Details.route) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth().height(200.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    Text("📷 Foto del cuarto", modifier = Modifier.padding(16.dp))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("Cuarto en Zona 10", fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("💰 Q1,500 / mes", fontSize = 18.sp, color = Color(0xFF1A8FFF))
            Spacer(modifier = Modifier.height(8.dp))
            Text("📍 Ciudad de Guatemala")
            Spacer(modifier = Modifier.height(8.dp))
            Text("🛏 1 cama • 🚿 Baño privado • 📶 WiFi incluido")
            Spacer(modifier = Modifier.weight(1f))
            Button(
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366))
            ) {
                Text("Contactar por WhatsApp", color = Color.White)
            }
        }
    }
}