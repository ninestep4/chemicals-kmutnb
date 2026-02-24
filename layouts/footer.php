<?php
declare(strict_types=1);
?>
        </main>
    </div>
</div>
<script src="<?php echo htmlspecialchars(asset('assets/js/main.js')); ?>"></script>
<?php if (!empty($pageScript)): ?>
<script src="<?php echo htmlspecialchars(asset($pageScript)); ?>"></script>
<?php endif; ?>
</body>
</html>
