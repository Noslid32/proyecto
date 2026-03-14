package com.example.proyecto_roomia

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.example.proyecto_roomia.navigation.AppNavigation// color rojo
import com.example.proyecto_roomia.ui.theme.ProyectoRoomIATheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ProyectoRoomIATheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF1A8FFF)
                ) {
                    AppNavigation() // color rojo
                }
            }
        }
    }
}