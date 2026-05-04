package com.example.proyecto_roomia


data class Cuarto(
    val id: String = "",
    val imageUrls: List<String> = emptyList(),
    val aiDescription: String = "",
    val style: String = "",
    val location: String = "",
    val price: String = "",
    val area: String = "",
    val ownerId: String = "",
    val isPublished: Boolean = false,
    val latitude: Double = 0.0,   // ← NUEVO
    val longitude: Double = 0.0,   // ← NUEVO


)