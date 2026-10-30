<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController; 
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\BahanController;
use App\Http\Controllers\Api\UkuranController;
use App\Http\Controllers\Api\ProductController;

Route::get('/test-koneksi', function () {
    try {
        DB::connection()->getPdo();
        return response()->json([
            'success' => true,
            'message' => 'Koneksi ke database ' . DB::connection()->getDatabaseName() . ' berhasil!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal konek: ' . $e->getMessage()
        ], 500);
    }
});
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Route yang membutuhkan autentikasi (misal menggunakan Sanctum atau token sederhana)
Route::middleware('auth:sanctum')->get('/user/profile', [UserController::class, 'profile']);
// Atau jika ingin rute publik/bebas akses sementara untuk testing dashboard:
Route::get('/users', [UserController::class, 'index']);
// Endpoint: /api/orders
Route::get('/orders', [OrderController::class, 'index']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::get('/pelanggan', [PelangganController::class, 'index']);
Route::get('/bahan', [BahanController::class, 'index']);
Route::get('/bahan/{id}', [BahanController::class, 'show']);
Route::post('/bahan', [BahanController::class, 'store']);
Route::put('/bahan/{id}', [BahanController::class, 'update']);
Route::delete('/bahan/{id}', [BahanController::class, 'destroy']);
Route::get('/ukuran', [UkuranController::class, 'index']);
Route::get('/ukuran/{id}', [UkuranController::class, 'show']);
Route::post('/ukuran', [UkuranController::class, 'store']);
Route::put('/ukuran/{id}', [UkuranController::class, 'update']);
Route::delete('/ukuran/{id}', [UkuranController::class, 'destroy']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
